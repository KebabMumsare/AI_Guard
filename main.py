import cv2
import sys
import argparse
import os
import time
import threading
from flask import Flask, Response, jsonify
from flask_cors import CORS
import mediapipe as mp

app = Flask(__name__)
CORS(app)

# Shared state
events = []
events_lock = threading.Lock()
latest_frame = None
frame_lock = threading.Lock()

def open_usb(index, width, height, fps):
    cap = cv2.VideoCapture(index, cv2.CAP_V4L2)
    if not cap.isOpened():
        return None
    cap.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc(*"MJPG"))
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, width)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, height)
    cap.set(cv2.CAP_PROP_FPS, fps)
    ok, _ = cap.read()
    if not ok:
        cap.release()
        return None
    return cap

def is_fist(landmarks, h, w):
    tips = [8, 12, 16, 20]
    pips = [6, 10, 14, 18]
    folded = sum(1 for t, p in zip(tips, pips) if landmarks[t].y * h > landmarks[p].y * h)
    return folded == 4

def generate_frames():
    while True:
        with frame_lock:
            if latest_frame is not None:
                ret, buffer = cv2.imencode('.jpg', latest_frame)
                if ret:
                    yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
        time.sleep(0.033)

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/events')
def get_events():
    with events_lock:
        result = list(events)
        events.clear()
    return jsonify(result)

def run_server(port):
    app.run(host='0.0.0.0', port=port, threaded=True)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--index", type=int, default=-1)
    ap.add_argument("--width", type=int, default=1280)
    ap.add_argument("--height", type=int, default=720)
    ap.add_argument("--fps", type=int, default=30)
    ap.add_argument("--port", type=int, default=5500)
    ap.add_argument("--no-gui", action="store_true")
    args = ap.parse_args()

    global latest_frame

    gui_allowed = (not args.no_gui) and bool(os.environ.get("DISPLAY"))

    if args.index >= 0:
        cap = open_usb(args.index, args.width, args.height, args.fps)
        if cap is None:
            print(f"Error: Failed to open camera {args.index}")
            sys.exit(1)
    else:
        cap = None
        for i in [0, 1, 2, 3]:
            print(f"Trying camera index {i}...")
            cap = open_usb(i, args.width, args.height, args.fps)
            if cap:
                print(f"Opened camera {i}")
                break
        if cap is None:
            print("Error: Could not open any USB camera.")
            sys.exit(1)

    # Start Flask server in background
    server_thread = threading.Thread(target=run_server, args=(args.port,), daemon=True)
    server_thread.start()
    print(f"Server running on port {args.port}")

    mp_hands = mp.solutions.hands
    hands = mp_hands.Hands(model_complexity=0, max_num_hands=1,
                           min_detection_confidence=0.5, min_tracking_confidence=0.5)

    print("Running. Ctrl+C to stop (or ESC in GUI mode).")
    fist_state = False

    while True:
        ok, frame = cap.read()
        if not ok:
            print("Failed to read frame")
            break

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        res = hands.process(rgb)
        h, w = frame.shape[:2]

        label = ""
        if res.multi_hand_landmarks:
            lms = res.multi_hand_landmarks[0].landmark
            if is_fist(lms, h, w):
                label = "ROCK (FIST)"
                if not fist_state:
                    print("ROCK detected")
                    with events_lock:
                        events.append({
                            "event_type": "Fist Detected",
                            "description": "Fist gesture detected",
                            "camera_id": "Camera 1",
                            "timestamp": time.time()
                        })
                fist_state = True
            else:
                fist_state = False
        else:
            fist_state = False

        if label:
            cv2.putText(frame, label, (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 255, 0), 2)

        with frame_lock:
            latest_frame = frame.copy()

        if gui_allowed:
            cv2.imshow("USB Camera", frame)
            if cv2.waitKey(1) & 0xFF == 27:
                break

    cap.release()
    if gui_allowed:
        cv2.destroyAllWindows()

if __name__ == "__main__":
    main()

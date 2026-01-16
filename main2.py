import cv2
import sys
import argparse
import os
import time
import mediapipe as mp
from flask import Flask, Response, render_template_string, jsonify
from flask_cors import CORS
import threading

app = Flask(__name__)
CORS(app)

# Global variables for camera and frame
camera = None
current_frame = None
frame_lock = threading.Lock()

# Events tracking
events = []
events_lock = threading.Lock()

api_data = {
    'fist_detected': False,
    'label': '',
    'frame_count': 0,
    'fps': 0.0,
    'timestamp': 0.0
}
api_data_lock = threading.Lock()

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
    folded = 0
    for t, p in zip(tips, pips):
        tip_y = landmarks[t].y * h
        pip_y = landmarks[p].y * h
        if tip_y > pip_y:
            folded += 1
    return folded == 4

def generate_frames():
    """Generator function to yield video frames for streaming"""
    global current_frame, frame_lock
    last_time = time.time()
    target_fps = 15  # Limit stream to 15 FPS for smoother playback
    
    while True:
        # Rate limiting to prevent overwhelming the network
        current_time = time.time()
        elapsed = current_time - last_time
        if elapsed < 1.0 / target_fps:
            time.sleep(1.0 / target_fps - elapsed)
        last_time = time.time()
        
        with frame_lock:
            if current_frame is None:
                continue
            # Encode frame as JPEG with lower quality for better performance
            ret, buffer = cv2.imencode('.jpg', current_frame, [cv2.IMWRITE_JPEG_QUALITY, 60])
            if not ret:
                continue
            frame_bytes = buffer.tobytes()
        
        # Yield frame in multipart format
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/')
def index():
    """Serve the main page"""
    html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Jetson Nano Camera Stream</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                text-align: center;
                background-color: #1a1a1a;
                color: white;
                margin: 0;
                padding: 20px;
            }
            h1 {
                margin-bottom: 20px;
            }
            img {
                max-width: 100%;
                height: auto;
                border: 2px solid #333;
                border-radius: 8px;
            }
        </style>
    </head>
    <body>
        <h1>Jetson Nano Camera Stream</h1>
        <img src="{{ url_for('video_feed') }}" alt="Video Stream">
    </body>
    </html>
    """
    return render_template_string(html)

@app.route('/api/status')
def api_status():
    """API endpoint to get current status"""
    global api_data, api_data_lock
    with api_data_lock:
        return jsonify(api_data)

@app.route('/api/fist')
def api_fist():
    """API endpoint to check if fist is detected"""
    global api_data, api_data_lock
    with api_data_lock:
        return jsonify({
            'fist_detected': api_data['fist_detected'],
            'label': api_data['label']
        })

@app.route('/events')
def get_events():
    """API endpoint to get and clear events"""
    global events, events_lock
    with events_lock:
        result = list(events)
        events.clear()
    return jsonify(result)

@app.route('/video_feed')
def video_feed():
    """Video streaming route"""
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

def camera_thread(args):
    """Thread to capture and process camera frames"""
    global camera, current_frame, frame_lock

    # Open USB cam
    if args.index >= 0:
        camera = open_usb(args.index, args.width, args.height, args.fps)
        if camera is None:
            print(f"Error: Failed to open camera {args.index}")
            sys.exit(1)
    else:
        camera = None
        for i in [0, 1, 2, 3]:
            print(f"Trying camera index {i}...")
            camera = open_usb(i, args.width, args.height, args.fps)
            if camera:
                print(f"Opened camera {i}")
                break
        if camera is None:
            print("Error: Could not open any USB camera.")
            sys.exit(1)

    mp_hands = mp.solutions.hands
    hands = mp_hands.Hands(model_complexity=0, max_num_hands=1,
                           min_detection_confidence=0.5, min_tracking_confidence=0.5)

    print("Camera thread started. Processing frames...")
    print(f"Resolution: {args.width}x{args.height} @ {args.fps} FPS")
    print(f"Processing MediaPipe every {args.process_every} frames")
    
    fist_state = False
    frame_count = 0
    last_label = ""
    fps_counter = 0
    fps_start_time = time.time()

    while True:
        ok, frame = camera.read()
        if not ok:
            print("Failed to read frame")
            break

        frame_count += 1
        fps_counter += 1
        
        if fps_counter >= args.fps:
            elapsed = time.time() - fps_start_time
            current_fps = fps_counter / elapsed if elapsed > 0 else 0
            fps_counter = 0
            fps_start_time = time.time()
            
            # Update API data
            with api_data_lock:
                api_data['fist_detected'] = fist_state
                api_data['label'] = label if 'label' in locals() else last_label
                api_data['frame_count'] = frame_count
                api_data['fps'] = current_fps
                api_data['timestamp'] = time.time()
        # Only process MediaPipe every N frames to reduce CPU load
        if frame_count % args.process_every == 0:
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
            
            last_label = label
            with api_data_lock:
                api_data['fist_detected'] = fist_state
                api_data['label'] = label
                api_data['frame_count'] = frame_count
                api_data['timestamp'] = time.time()
        else:
            # Use previous label to maintain continuity
            label = last_label

            with api_data_lock:
                api_data['fist_detected'] = fist_state
                api_data['label'] = label
                api_data['frame_count'] = frame_count

        # Draw label on frame
        if label:
            cv2.putText(frame, label, (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 255, 0), 2)

        # Update current frame for streaming (only update every other frame to reduce lock contention)
        with frame_lock:
            if frame_count % 2 == 0:  # Update every other frame
                current_frame = frame.copy()

    camera.release()

if __name__ == '__main__':
    # Parse command line arguments
    ap = argparse.ArgumentParser()
    ap.add_argument("--index", type=int, default=-1)
    ap.add_argument("--width", type=int, default=640)   # Lower default for better performance
    ap.add_argument("--height", type=int, default=480)  # Lower default for better performance
    ap.add_argument("--fps", type=int, default=15)     # Lower default for smoother streaming
    ap.add_argument("--port", type=int, default=5000)
    ap.add_argument("--process-every", type=int, default=3, help="Process MediaPipe every N frames (default: 3)")
    args = ap.parse_args()
    
    # Start camera thread
    cam_thread = threading.Thread(target=camera_thread, args=(args,), daemon=True)
    cam_thread.start()
    
    # Give camera time to initialize
    time.sleep(2)
    
    # Start Flask server
    print("Starting web server...")
    print(f"Open http://localhost:5500 in your browser")
    print(f"Or access from another device: http://<jetson-ip>:5500")
    app.run(host='0.0.0.0', port=5500, threaded=True, debug=False)

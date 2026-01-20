import cv2
import sys
import argparse
import os
import time
import mediapipe as mp
from flask import Flask, Response, render_template_string, jsonify
from flask_cors import CORS
import threading
import requests

app = Flask(__name__)
CORS(app)

# Configuration - Node.js backend URL
NODE_BACKEND_URL = os.environ.get('NODE_BACKEND_URL', 'http://localhost:3000')

# Global variables for camera and frame
camera = None
current_frame = None
frame_lock = threading.Lock()

# Events tracking
events = []
events_lock = threading.Lock()


def send_event_to_backend(event_data):
    """Send event to Node.js backend asynchronously"""

    def send():
        try:
            response = requests.post(
                f'{NODE_BACKEND_URL}/api/log',
                json=event_data,
                timeout=2  # 2 second timeout
            )
            if response.status_code == 200:
                print(f"Event sent to backend: {event_data['event_type']}")
            else:
                print(f"Backend responded with status {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"Failed to send event to backend: {e}")

    # Send in background thread to not block camera processing
    thread = threading.Thread(target=send, daemon=True)
    thread.start()

api_data = {
    'gesture': None,  # 'rock', 'paper', 'scissors', 'middle_finger', or None
    'rock_detected': False,
    'paper_detected': False,
    'scissors_detected': False,
    'middle_finger_detected': False,
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

def is_finger_extended(landmarks, tip_idx, pip_idx, h, threshold=0):
    """Check if a finger is extended (tip above pip with optional threshold)"""
    tip_y = landmarks[tip_idx].y * h
    pip_y = landmarks[pip_idx].y * h
    return tip_y < (pip_y + threshold)

def get_finger_curl(landmarks, tip_idx, pip_idx, mcp_idx, h):
    """Get how much a finger is curled (higher = more curled)"""
    tip_y = landmarks[tip_idx].y * h
    pip_y = landmarks[pip_idx].y * h
    mcp_y = landmarks[mcp_idx].y * h
    # Return relative position of tip compared to pip-mcp range
    return (tip_y - pip_y) / max(abs(mcp_y - pip_y), 1)

def is_fist(landmarks, h, w):
    """Rock: All 4 fingers folded (fist)"""
    tips = [8, 12, 16, 20]
    pips = [6, 10, 14, 18]
    folded = 0
    for t, p in zip(tips, pips):
        tip_y = landmarks[t].y * h
        pip_y = landmarks[p].y * h
        # Add small threshold - tip just needs to be near or below pip
        if tip_y > pip_y - (h * 0.02):
            folded += 1
    return folded == 4  # All 4 fingers must be folded

def is_scissors(landmarks, h, w):
    """Scissors: Index and middle finger clearly extended, ring and pinky clearly folded"""
    # Finger landmarks: tip, dip, pip, mcp
    # Index: 8, 7, 6, 5
    # Middle: 12, 11, 10, 9
    # Ring: 16, 15, 14, 13
    # Pinky: 20, 19, 18, 17
    
    # Get curl values for all fingers
    index_curl = get_finger_curl(landmarks, 8, 6, 5, h)
    middle_curl = get_finger_curl(landmarks, 12, 10, 9, h)
    ring_curl = get_finger_curl(landmarks, 16, 14, 13, h)
    pinky_curl = get_finger_curl(landmarks, 20, 18, 17, h)
    
    # Index and middle must be clearly extended (negative curl or near zero)
    index_extended = index_curl < 0.3
    middle_extended = middle_curl < 0.3
    
    # Ring and pinky must be clearly MORE folded than index/middle
    ring_folded = ring_curl > 0.5
    pinky_folded = pinky_curl > 0.4
    
    # Both index and middle extended, AND both ring and pinky folded
    return index_extended and middle_extended and ring_folded and pinky_folded

def is_middle_finger(landmarks, h, w):
    """Middle finger: Only middle finger extended, all others folded"""
    # Get curl values for all fingers
    index_curl = get_finger_curl(landmarks, 8, 6, 5, h)
    middle_curl = get_finger_curl(landmarks, 12, 10, 9, h)
    ring_curl = get_finger_curl(landmarks, 16, 14, 13, h)
    pinky_curl = get_finger_curl(landmarks, 20, 18, 17, h)
    
    # Middle finger must be extended
    middle_extended = middle_curl < 0.6
    
    # Other fingers should be more curled than middle (at least 2 of them)
    fingers_more_folded = 0
    if index_curl > middle_curl + 0.1:
        fingers_more_folded += 1
    if ring_curl > middle_curl + 0.1:
        fingers_more_folded += 1
    if pinky_curl > middle_curl + 0.1:
        fingers_more_folded += 1
    
    # At least 2 other fingers should be more folded than middle
    return middle_extended and fingers_more_folded >= 2

def is_paper(landmarks, h, w):
    """Paper: All 4 fingers clearly extended (open hand)"""
    tips = [8, 12, 16, 20]
    pips = [6, 10, 14, 18]
    mcps = [5, 9, 13, 17]
    extended = 0
    for t, p, m in zip(tips, pips, mcps):
        curl = get_finger_curl(landmarks, t, p, m, h)
        # Finger must be clearly extended (low curl value)
        if curl < 0.3:
            extended += 1
    return extended == 4  # All 4 fingers must be extended

def detect_gesture(landmarks, h, w):
    """Detect rock, paper, scissors, or middle finger gesture"""
    # Check middle finger FIRST (before fist, since fist would match 3 folded fingers)
    if is_middle_finger(landmarks, h, w):
        return 'middle_finger', 'MIDDLE FINGER'
    elif is_fist(landmarks, h, w):
        return 'rock', 'ROCK (FIST)'
    elif is_scissors(landmarks, h, w):
        return 'scissors', 'SCISSORS (PEACE)'
    elif is_paper(landmarks, h, w):
        return 'paper', 'PAPER (OPEN HAND)'
    return None, ''

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
    """API endpoint to check if fist is detected (legacy)"""
    global api_data, api_data_lock
    with api_data_lock:
        return jsonify({
            'fist_detected': api_data['rock_detected'],
            'label': api_data['label']
        })

@app.route('/api/gesture')
def api_gesture():
    """API endpoint to check current gesture (rock/paper/scissors/middle_finger)"""
    global api_data, api_data_lock
    with api_data_lock:
        return jsonify({
            'gesture': api_data['gesture'],
            'rock_detected': api_data['rock_detected'],
            'paper_detected': api_data['paper_detected'],
            'scissors_detected': api_data['scissors_detected'],
            'middle_finger_detected': api_data['middle_finger_detected'],
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
    
    current_gesture = None  # 'rock', 'paper', 'scissors', or None
    frame_count = 0
    last_label = ""
    fps_counter = 0
    fps_start_time = time.time()
    last_process_time = 0  # Track when we last processed MediaPipe

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
                api_data['gesture'] = current_gesture
                api_data['rock_detected'] = current_gesture == 'rock'
                api_data['paper_detected'] = current_gesture == 'paper'
                api_data['scissors_detected'] = current_gesture == 'scissors'
                api_data['middle_finger_detected'] = current_gesture == 'middle_finger'
                api_data['label'] = label if 'label' in locals() else last_label
                api_data['frame_count'] = frame_count
                api_data['fps'] = current_fps
                api_data['timestamp'] = time.time()
        # Only process MediaPipe every N seconds to reduce CPU load
        current_time = time.time()
        if current_time - last_process_time >= args.process_interval:
            last_process_time = current_time
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            res = hands.process(rgb)
            h, w = frame.shape[:2]

            label = ""
            detected_gesture = None
            if res.multi_hand_landmarks:
                lms = res.multi_hand_landmarks[0].landmark
                detected_gesture, label = detect_gesture(lms, h, w)
                
                # Log event if gesture changed
                if detected_gesture and detected_gesture != current_gesture:
                    gesture_names = {
                        'rock': ('ROCK', 'Fist gesture detected'),
                        'paper': ('PAPER', 'Open hand gesture detected'),
                        'scissors': ('SCISSORS', 'Peace sign gesture detected'),
                        'middle_finger': ('MIDDLE FINGER', 'Middle finger gesture detected')
                    }
                    name, desc = gesture_names[detected_gesture]
                    print(f"{name} detected")

                    event_data = {
                        "event_type": f"{name} Detected",
                        "description": desc,
                        "camera_id": "Camera 1",
                        "timestamp": time.time()
                    }

                    # Store locally (for /events endpoint)
                    with events_lock:
                        events.append(event_data)

                    # Send to Node.js backend
                    send_event_to_backend(event_data)
                
                current_gesture = detected_gesture
            else:
                current_gesture = None
            
            last_label = label
            with api_data_lock:
                api_data['gesture'] = current_gesture
                api_data['rock_detected'] = current_gesture == 'rock'
                api_data['paper_detected'] = current_gesture == 'paper'
                api_data['scissors_detected'] = current_gesture == 'scissors'
                api_data['middle_finger_detected'] = current_gesture == 'middle_finger'
                api_data['label'] = label
                api_data['frame_count'] = frame_count
                api_data['timestamp'] = time.time()
        else:
            # Use previous label to maintain continuity
            label = last_label

            with api_data_lock:
                api_data['gesture'] = current_gesture
                api_data['rock_detected'] = current_gesture == 'rock'
                api_data['paper_detected'] = current_gesture == 'paper'
                api_data['scissors_detected'] = current_gesture == 'scissors'
                api_data['middle_finger_detected'] = current_gesture == 'middle_finger'
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
    ap.add_argument("--process-interval", type=float, default=0.7, help="Process MediaPipe every N seconds (default: 0.5)")
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

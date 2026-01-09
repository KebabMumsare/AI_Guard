import cv2
import sys
import argparse
import os
import time
import mediapipe as mp

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
    # All finger tips below their PIP joints => closed fist (rock)
    tips = [8, 12, 16, 20]
    pips = [6, 10, 14, 18]
    folded = 0
    for t, p in zip(tips, pips):
        tip_y = landmarks[t].y * h
        pip_y = landmarks[p].y * h
        if tip_y > pip_y:
            folded += 1
    return folded == 4

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--index", type=int, default=-1)
    ap.add_argument("--width", type=int, default=1280)
    ap.add_argument("--height", type=int, default=720)
    ap.add_argument("--fps", type=int, default=30)
    ap.add_argument("--no-gui", action="store_true", help="Run without cv2.imshow")
    args = ap.parse_args()

    gui_allowed = (not args.no_gui) and bool(os.environ.get("DISPLAY"))

    # Open USB cam (auto-try 0..3 if not specified)
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

    mp_hands = mp.solutions.hands
    hands = mp_hands.Hands(model_complexity=0, max_num_hands=1,
                           min_detection_confidence=0.5, min_tracking_confidence=0.5)

    print("Running. Ctrl+C to stop (or ESC in GUI mode).")
    t0, frames = time.time(), 0
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
                fist_state = True
            else:
                fist_state = False
        else:
            fist_state = False

        if gui_allowed:
            if label:
                cv2.putText(frame, label, (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 255, 0), 2)
            cv2.imshow("USB Camera", frame)
            if cv2.waitKey(1) & 0xFF == 27:  # ESC
                break

        frames += 1
        if frames % 120 == 0:
            dt = time.time() - t0
            fps = frames / dt if dt > 0 else 0
            print(f"{fps:.1f} FPS")
            frames = 0
            t0 = time.time()

    cap.release()
    if gui_allowed:
        cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
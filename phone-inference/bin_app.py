import os
import time
import requests
import numpy as np
from PIL import Image
import onnxruntime as ort

DATABASE_URL = "https://recyclebin-d3be8-default-rtdb.firebaseio.com"

IMAGE_PATH = "/sdcard/Download/input.jpg"

session = ort.InferenceSession("best.onnx")
input_name = session.get_inputs()[0].name

classes = [
    "background",
    "can",
    "plastic"
]

def preprocess(img):
    img = img.resize((224, 224))

    arr = np.array(img).astype(np.float32)

    arr = arr / 255.0

    arr = np.transpose(arr, (2, 0, 1))

    arr = np.expand_dims(arr, axis=0)

    return arr

def increment_counter(label):

    # Get active session
    active_session = requests.get(
        f"{DATABASE_URL}/activeSession.json"
    ).json()

    if not active_session:
        print("No active session")
        return

    session_url = (
        f"{DATABASE_URL}/sessions/"
        f"{active_session}.json"
    )

    response = requests.get(session_url)

    data = response.json() or {}

    plastic = data.get("plasticCount", 0)
    metal = data.get("metalCount", 0)

    if label == "plastic":
        plastic += 1

    elif label == "can":
        metal += 1

    requests.patch(
        session_url,
        json={
            "plasticCount": plastic,
            "metalCount": metal,
            "lastActivity": time.strftime(
                "%Y-%m-%d %H:%M:%S"
            )
        }
    )

    print(
        f"Firebase updated: {active_session}"
    )

print("Watching for images...")

last_modified = 0

while True:

    try:

        if not os.path.exists(IMAGE_PATH):
            time.sleep(1)
            continue

        modified = os.path.getmtime(
            IMAGE_PATH
        )

        if modified == last_modified:
            time.sleep(1)
            continue

        last_modified = modified

        print("New image detected")

        img = Image.open(
            IMAGE_PATH
        ).convert("RGB")

        input_tensor = preprocess(img)

        outputs = session.run(
            None,
            {input_name: input_tensor}
        )

        probs = outputs[0][0]

        pred_idx = int(np.argmax(probs))

        confidence = float(
            probs[pred_idx]
        )

        label = classes[pred_idx]

        print(
            f"Prediction: {label}  "
            f"Confidence: {confidence:.3f}"
        )

        if (
            label != "background"
            and confidence > 0.85
        ):
            increment_counter(label)

        else:
            print(
                "Ignored "
                "(background or low confidence)"
            )

    except Exception as e:
        print("ERROR:", e)

    time.sleep(1)

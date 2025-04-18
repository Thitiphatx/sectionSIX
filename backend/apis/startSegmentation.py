import os
from mmseg.apis.inference import inference_model, init_model
import numpy as np
import torch
from config import MODEL_LIST
from utils.image_processing import applyOverlay
from collections import defaultdict


def startSegmentation(clusterId, versionId, model):
    print(clusterId, versionId, model)
    
    config_file = os.path.join("mmsegmentation", 'configs', MODEL_LIST[model]["model"], MODEL_LIST[model]["config"])
    checkpoint_file = os.path.join("mmsegmentation", 'checkpoints', MODEL_LIST[model]["model"], MODEL_LIST[model]["checkpoint"])

    img_dir = os.path.join("..", "storage", "clusters", clusterId, "versions", versionId, "images")
    out_dir = os.path.join("..", "storage", "clusters", clusterId, "versions", versionId, "segments")

    if not os.path.exists(out_dir):
        os.makedirs(out_dir)

    image_files = sorted([img for img in os.listdir(img_dir) if img.lower().endswith(('.jpg', '.jpeg'))])

    # Initialize Model
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    model = init_model(config_file, checkpoint_file, device=device)

    all_class_counts = defaultdict(int)  # Track class frequencies
    threshold = 5  # Minimum number of occurrences to include

    for i, image_name in enumerate(image_files):
        img_raw = os.path.join(img_dir, image_name)
        frame = applyOverlay(img_raw, "./assets/car_overlay.png")

        data_sample = inference_model(model, frame)

        seg_array = data_sample.pred_sem_seg.cpu().data.numpy()
        np.savez(os.path.join(out_dir, image_name.replace(".jpg", ".npz")), data=seg_array)
        
        unique_class = np.unique(seg_array.flatten())
        for cls in unique_class:
            all_class_counts[cls] += 1
        
        torch.cuda.empty_cache()
        yield f"data: {{\"current_image\": \"{image_name}\", \"progress\": {round((i + 1) / len(image_files) * 100)}, \"unique_class\": {list(unique_class)}}}\n\n"
    frequent_classes = [
        cls for cls, count in all_class_counts.items() 
        if count >= threshold
    ]
    # Final yield with all detected unique classes
    yield f"data: {{\"current_image\": \"Done\", \"progress\": 100, \"unique_class\": {frequent_classes}}}\n\n"
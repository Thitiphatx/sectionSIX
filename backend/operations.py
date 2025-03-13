import numpy as np
import os

def color_mapper(raw_prediction_data):
    cityscapes_classes = [
        (0, (0, 0, 0)),         # Background/Ignored
        (1, (128, 64, 128)),    # Road
        (2, (244, 35, 232)),    # Sidewalk
        (3, (70, 70, 70)),      # Building
        (4, (102, 102, 156)),   # Wall
        (5, (190, 153, 153)),   # Fence
        (6, (153, 153, 153)),   # Pole
        (7, (250, 170, 30)),    # Traffic Light
        (8, (220, 220, 0)),     # Traffic Sign
        (9, (107, 142, 35)),    # Vegetation
        (10, (152, 251, 152)),  # Terrain
        (11, (70, 130, 180)),   # Sky
        (12, (220, 20, 60)),    # Person
        (13, (255, 0, 0)),      # Rider
        (14, (0, 0, 142)),      # Car
        (15, (0, 0, 70)),       # Truck
        (16, (0, 60, 100)),     # Bus
        (17, (0, 80, 100)),     # Train
        (18, (0, 0, 230)),      # Motorcycle
        (19, (119, 11, 32)),    # Bicycle
    ]

    color_map = {class_id: color for class_id, color in cityscapes_classes}
    max_class = max([class_id for class_id, _ in cityscapes_classes]) + 1
    color_array = np.zeros((max_class, 3), dtype=np.uint8)

    for class_id, color in color_map.items():
        color_array[class_id] = color

    prediction_mask = color_array[raw_prediction_data]
    return prediction_mask

# def convert_to_array():

def get_images(image_folder):
    images = sorted([img for img in os.listdir(image_folder) if img.endswith((".png", ".jpg", ".jpeg"))])
    return images

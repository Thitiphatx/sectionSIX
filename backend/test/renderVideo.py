import os
import cv2
import torch
import mmcv
from mmseg.visualization import SegLocalVisualizer
import os.path as osp
import re


input_folder = "C:/Users/Champ/Desktop/LidarRGB/1_Data_Pic/IMAGE_OUTPUT"

video_dir = "./video2.mp4"

print(input_folder)  # Debugging

# Load pre-processed data
images = [img for img in sorted(os.listdir(input_folder)) if img.endswith(('.png', '.jpg', '.jpeg'))]
    
if not images:
    print("No images found in the directory!")
    
# Filter images in the range img_002000.jpg to img_003000.jpg
images = [img for img in images if re.match(r'img_\d{6}\.jpg', img) and 500 <= int(img[4:10]) <= 2700]

fourcc = cv2.VideoWriter_fourcc(*'avc1')
fps = 30.0
video_writer = cv2.VideoWriter(video_dir, cv2.CAP_FFMPEG, fourcc, fps, (1440, 720))
total_frames = len(images)

for idx, image in enumerate(images):
    img_path = os.path.join(input_folder, image)
    image = mmcv.imread(os.path.join(img_path), 'color')
    frame = mmcv.imresize(image, (1440, 720))

    video_writer.write(frame)
    progress = round((idx + 1) / total_frames * 100)
    print(progress)

video_writer.release()

import os
import cv2
import numpy as np
import torch
import mmcv
from mmseg.visualization import SegLocalVisualizer
import os.path as osp
from mmseg.apis import init_model
from mmseg.structures import SegDataSample
from mmengine.structures import PixelData

def npztoseg(filePath):
    result = np.load(filePath)
    sem_seg = torch.from_numpy(result["data"])
    gt_sem_seg_data = dict(data=sem_seg)
    gt_sem_seg = PixelData(**gt_sem_seg_data)
    data_sample = SegDataSample()
    data_sample.gt_sem_seg = gt_sem_seg

    return data_sample

# Configuration
config_file = './mmsegmentation/configs/segformer/segformer_mit-b5_8xb2-160k_ade20k-512x512.py'  # Update with your config pathre
checkpoint_file = './mmsegmentation/checkpoints/segformer/segformer_mit-b5_512x512_160k_ade20k_20210726_145235-94cedf59.pth'  # Update with your checkpoint path

output_dir = 'D:/Project/section6/output'  # Update with your output directory
video_output_path = 'D:/Project/section6/output/video.mp4'  # Update with your desired video output path

# Initialize the model to get dataset metadata
model = init_model(config_file, checkpoint_file, device='cuda:0')
dataset_meta = model.dataset_meta

seg_local_visualizer = SegLocalVisualizer(
    vis_backends=[dict(type='LocalVisBackend')]
)
seg_local_visualizer.dataset_meta = dataset_meta

# Get the list of .pt files
npz_files = sorted([f for f in os.listdir(output_dir) if f.endswith('.npz')])
if not npz_files:
    raise ValueError("No .pt files found in the output directory")

width, height = (1440, 720)

# Set up video writer
fourcc = cv2.VideoWriter_fourcc(*'avc1')
fps = 30.0
video_writer = cv2.VideoWriter(video_output_path, cv2.VideoWriter_fourcc(*'mp4v'), fps, (width, height))

total_frames = len(npz_files)
print(f"Processing {total_frames} frames...")
for idx, npz_file in enumerate(npz_files):
    npz_path = os.path.join(output_dir, npz_file)
    ds = npztoseg(npz_path)
    
    # Create a blank image
    image = mmcv.imread(os.path.join("C:/Users/Champ/Desktop/LidarRGB/1_Data_Pic/IMAGE_OUTPUT", npz_file.replace('.npz', '.jpg')), 'color')
    image = mmcv.imresize(image, (1440, 720))
    
    seg_local_visualizer.add_datasample(
        name='frame',
        image=image,
        data_sample=ds,
        show=False,
        with_labels=True,
    )
    frame = seg_local_visualizer.get_image()
    video_writer.write(frame)
    
    print(f"Processed frame {idx + 1}/{total_frames}")

video_writer.release()
print("Video saved at:", video_output_path)
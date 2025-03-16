import os
from mmseg.apis.inference import inference_model, init_model
import torch
from mmcv.image import imread, imresize
from torch.cuda.amp import autocast
from mmseg.visualization import SegLocalVisualizer
from mmseg.structures import SegDataSample
from mmengine.structures import PixelData
import cv2

import numpy as np

def savetonpz(filePath, segData):
    tensorData = segData.pred_sem_seg.cpu().data.numpy()
    np.savez(filePath, data=tensorData)

def npztoseg(filePath):
    result = np.load(filePath)
    sem_seg = torch.from_numpy(result["data"])
    gt_sem_seg_data = dict(data=sem_seg)
    gt_sem_seg = PixelData(**gt_sem_seg_data)
    data_sample = SegDataSample()
    data_sample.gt_sem_seg = gt_sem_seg

    return data_sample

def applyOverlay(img_path):
    img = imread(img_path)
    img = imresize(img, (1440, 720))

    overlay = imread("C:/Users/Champ/Desktop/LidarRGB/car_overlay.png", cv2.IMREAD_UNCHANGED)
    bgr, alpha = overlay[:, :, :3], overlay[:, :, 3] / 255.0
    for c in range(3):  # Loop over B, G, R channels
        img[:, :, c] = (1 - alpha) * img[:, :, c] + alpha * bgr[:, :, c]
    
    return img

# Configuration
config_file = './mmsegmentation/configs/segformer/segformer_mit-b5_8xb2-160k_ade20k-512x512.py'  # Update with your config pathre
checkpoint_file = './mmsegmentation/checkpoints/segformer/segformer_mit-b5_512x512_160k_ade20k_20210726_145235-94cedf59.pth'  # Update with your checkpoint path
img_dir = 'C:/Users/Champ/Desktop/LidarRGB/1_Data_Pic/IMAGE_OUTPUT'  # Update with your image directory
out_dir = "D:/Project/section6/output"

image_files = sorted(os.listdir(img_dir))

segmentation_results = {}
# # Initialize the model with mixed precision
model = init_model(config_file, checkpoint_file, device='cuda:0')

# # Reduce batch size if using a dataloader (not needed for single inference)
if hasattr(model.cfg, 'data') and hasattr(model.cfg.data, 'test_dataloader'):
    model.cfg.data.test_dataloader.batch_size = 1

selected_image_files = image_files[500:2701]

for img_name in selected_image_files:
    img_path = os.path.join(img_dir, img_name)
    img = applyOverlay(img_path)
    # Run inference
    result = inference_model(model, img)
    
    # Extract segmentation result and convert to NumPy
    seg_array = result.pred_sem_seg.cpu().data.numpy()
    np.savez(os.path.join(out_dir, img_name.replace(".jpg", ".npz")), data=seg_array)
    print(f"Processed: {img_name}")

    # Clear CUDA cache to free memory
    torch.cuda.empty_cache()

# Save all segmentation results into one NPZ file


# result = inference_model(model, "img_000000.png")
# savetonpz("test.npz", result)

# Read and resize the image to reduce memory usage
# img = imread("img_000000.png")

# ds = npztoseg("test.npz")

# dataset_meta = model.dataset_meta

# seg_local_visualizer = SegLocalVisualizer(
#     vis_backends=[dict(type='LocalVisBackend')]
# )
# seg_local_visualizer.dataset_meta = dataset_meta

# seg_local_visualizer.add_datasample(
#     name='frame',
#     image=img,
#     data_sample=ds,
#     show=True,
#     with_labels=True,
# )
# Clear CUDA cache
# torch.cuda.empty_cache()
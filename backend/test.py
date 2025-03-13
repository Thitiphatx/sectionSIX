import os
from mmseg.apis.inference import inference_model, init_model
import torch
from mmcv.image import imread, imresize
from torch.cuda.amp import autocast

# Configuration
config_file = './mmsegmentation/configs/segformer/segformer_mit-b0_8xb2-160k_ade20k-512x512.py'  # Update with your config path
checkpoint_file = './mmsegmentation/checkpoints/segformer/segformer_mit-b0_512x512_160k_ade20k_20210726_101530-8ffa8fda.pth'  # Update with your checkpoint path
img_dir = 'C:/Users/Champ/Desktop/LidarRGB/1_Data_Pic/IMAGE_OUTPUT'  # Update with your image directory
output_dir = 'D:/Project/section6/output'  # Update with your desired output directory


# Create output directory if not exists
os.makedirs(output_dir, exist_ok=True)

# Initialize the model with mixed precision
model = init_model(config_file, checkpoint_file, device='cuda:0')

# Reduce batch size if using a dataloader (not needed for single inference)
if hasattr(model.cfg, 'data') and hasattr(model.cfg.data, 'test_dataloader'):
    model.cfg.data.test_dataloader.batch_size = 1

img_files = sorted(os.listdir(img_dir))

# Process each image in the directory
for i, img_name in enumerate(img_files[2618:2701]):
    img_path = os.path.join(img_dir, img_name)
    if not os.path.isfile(img_path):
        continue
    
    # Read and resize the image to reduce memory usage
    img = imread(img_path)
    img = imresize(img, (1440, 720))  # Resize to a smaller resolution to avoid OOM errors
    
    # Clear CUDA cache
    torch.cuda.empty_cache()
    
    # Perform inference with mixed precision
    with autocast():
        result = inference_model(model, img)
    
    # Convert result to tensor and save it
    output_path = os.path.join(output_dir, f"{os.path.splitext(img_name)[0]}.pt")
    torch.save(result, output_path)
    print(f"Saved: {output_path}")

print("Inference completed for images 2600 to 2700.")


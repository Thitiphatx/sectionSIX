import os
import cv2
from mmseg.apis import MMSegInferencer

# Initialize inferencer with SegFormer model
inferencer = MMSegInferencer(model="segformer_mit-b0_8xb2-160k_ade20k-512x512")

# Input images directory
image_folder = "../storage/clusters/1720b249-20a0-4cc9-9206-2a543e2b2aa5/versions/37bd41b2-69ab-44cc-ba6c-daf775da99b8/images"

# Output directories
output_dir = "outputs"
vis_dir = "vis"
pred_dir = "pred"

# Get image list
image_files = sorted([f for f in os.listdir(image_folder) if f.endswith((".jpg", ".png"))])

for img_file in image_files:
    img_path = os.path.join(image_folder, img_file)

    # Read and resize image
    img = cv2.imread(img_path)
    resized_img = cv2.resize(img, (1440, 720))

    # Run inference
    inferencer(resized_img, show=False, out_dir=output_dir, img_out_dir=vis_dir, pred_out_dir=pred_dir)

    print(f"Processed: {img_file}")

print("✅ All images processed and saved!")

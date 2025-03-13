from mmcv.image import imread, imresize
import cv2
def applyOverlay(img_path, overlay_path):
    img = imread(img_path)
    img = imresize(img, (1440, 720))

    overlay = imread(overlay_path, cv2.IMREAD_UNCHANGED)
    bgr, alpha = overlay[:, :, :3], overlay[:, :, 3] / 255.0
    for c in range(3):  # Loop over B, G, R channels
        img[:, :, c] = (1 - alpha) * img[:, :, c] + alpha * bgr[:, :, c]
    
    return img
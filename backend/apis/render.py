import os
import cv2
import mmcv
from mmseg.visualization import SegLocalVisualizer
from mmseg.apis.inference import init_model
import os.path as osp
from time import sleep
from utils.numpy_zip import npztoseg

def renderVideo(clusterId, versionId, showLabel, classes):
    showLabelBool = showLabel.lower() == "true"

    model = init_model(
        "./mmsegmentation/configs/segformer/segformer_mit-b5_8xb2-160k_ade20k-512x512.py", 
        "./mmsegmentation/checkpoints/segformer/segformer_mit-b5_512x512_160k_ade20k_20210726_145235-94cedf59.pth", device='cuda:0')
    dataset_meta = model.dataset_meta
    seg_local_visualizer = SegLocalVisualizer(
        vis_backends=[dict(type='LocalVisBackend')]
    )
    seg_local_visualizer.dataset_meta = dataset_meta

    segments_dir = os.path.join("..", "storage", "clusters", clusterId, "versions", versionId, "segments")
    npz_files = sorted([f for f in os.listdir(segments_dir) if f.endswith('.npz')])
    if not npz_files:
        raise ValueError("No .pt files found in the output directory")

    prefix = "l_" if showLabelBool else "nl_"
    video_name = prefix + classes.replace(",", "_") + ".mp4"

    video_dir = os.path.join("..", "storage", "clusters", clusterId, "versions", versionId, "videos")
    if not os.path.exists(video_dir):
        os.makedirs(video_dir)
    output_folder = os.path.join(video_dir, video_name)
    
    # Check if video already exists
    if os.path.exists(output_folder):
        yield f"data: {{\"current_image\": \"Done\", \"progress\": 100}}\n\n"
        return

    width, height = (1440, 720)
    fourcc = cv2.VideoWriter_fourcc(*'avc1')
    fps = 30.0
    video_writer = cv2.VideoWriter(output_folder, cv2.CAP_FFMPEG, fourcc, fps, (width, height))
    total_frames = len(npz_files)

    selected_classes = [int(class_id) for class_id in classes.split(',')]

    for idx, npz_file in enumerate(npz_files):
        npz_path = os.path.join(segments_dir, npz_file)
        ds = npztoseg(npz_path)

        pred_mask = ds.pred_sem_seg.data
        modified_mask = pred_mask.clone()
        
        for class_id in range(len(seg_local_visualizer.dataset_meta['classes'])):
            if class_id not in selected_classes:
                modified_mask[modified_mask == class_id] = 255
        
        ds.pred_sem_seg.data = modified_mask
        image_path = os.path.join("..", "storage", "clusters", clusterId, "versions", versionId, "images", npz_file.replace('.npz', '.jpg'))
        image = mmcv.imread(osp.join(osp.dirname(__file__), image_path), 'color')
        image = mmcv.imresize(image, (1440, 720))

        seg_local_visualizer.add_datasample(
            name='frame',
            image=image,
            data_sample=ds,
            show=False,
            with_labels=showLabelBool,
        )
        frame = seg_local_visualizer.get_image()
        video_writer.write(frame)

        progress = round((idx + 1) / total_frames * 100)
        yield f"data: {{\"current_image\": \"{idx}\", \"progress\": {progress}}}\n\n"
    
    video_writer.release()
    yield f"data: {{\"current_image\": \"Done\", \"progress\": 100}}\n\n"

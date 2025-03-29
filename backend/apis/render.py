import os
import cv2
import mmcv
import threading
from queue import Queue
from threading import Thread
from mmseg.visualization import SegLocalVisualizer
from mmseg.apis.inference import init_model
import os.path as osp
import torch
from utils.numpy_zip import npztoseg


def renderVideo(clusterId, versionId, showLabel, classes):
    showLabelBool = showLabel.lower() == "true"

    # Model initialization with mixed precision enabled
    model = init_model(
        "./mmsegmentation/configs/segformer/segformer_mit-b5_8xb2-160k_ade20k-512x512.py", 
        "./mmsegmentation/checkpoints/segformer/segformer_mit-b5_512x512_160k_ade20k_20210726_145235-94cedf59.pth", 
        device='cuda:0'
    )
    model.half()
    model.eval()

    dataset_meta = model.dataset_meta
    seg_local_visualizer = SegLocalVisualizer(
        vis_backends=[dict(type='LocalVisBackend')],
    )
    seg_local_visualizer.dataset_meta = dataset_meta

    # File setup
    segments_dir = os.path.join("..", "storage", "clusters", clusterId, "versions", versionId, "segments")
    npz_files = sorted([f for f in os.listdir(segments_dir) if f.endswith('.npz')])
    if not npz_files:
        raise ValueError("No .npz files found in the output directory")

    prefix = "l_" if showLabelBool else "nl_"
    video_name = prefix + classes.replace(",", "_") + ".mp4"
    video_dir = os.path.join("..", "storage", "clusters", clusterId, "versions", versionId, "videos")
    os.makedirs(video_dir, exist_ok=True)
    output_folder = os.path.join(video_dir, video_name)
    
    if os.path.exists(output_folder):
        yield f"data: {{\"current_image\": \"Done\", \"progress\": 100}}\n\n"
        return

    # Video writer setup
    width, height = (1440, 720)
    fourcc = cv2.VideoWriter_fourcc(*'avc1')
    fps = 30.0
    video_writer = cv2.VideoWriter(output_folder, cv2.CAP_FFMPEG, fourcc, fps, (width, height))
    
    # Queue and threading setup
    frame_queue = Queue(maxsize=30)
    stop_event = threading.Event()

    def writer_thread():
        while not stop_event.is_set() or not frame_queue.empty():
            frame = frame_queue.get()
            video_writer.write(frame)
            frame_queue.task_done()
        video_writer.release()

    Thread(target=writer_thread, daemon=True).start()

    # Processing loop with optimizations
    total_frames = len(npz_files)
    selected_classes = [int(class_id) for class_id in classes.split(',')]

    try:
        for idx, npz_file in enumerate(npz_files):
            npz_path = os.path.join(segments_dir, npz_file)
            ds = npztoseg(npz_path)

            with torch.no_grad(), torch.cuda.amp.autocast():  # Mixed precision and no gradients
                pred_mask = ds.gt_sem_seg.data.to('cuda')  # Ensure tensor is on the GPU

            class_mask = torch.isin(pred_mask, torch.tensor(selected_classes, device='cuda'))
            modified_mask = torch.where(class_mask, pred_mask, 255).to('cuda')
            ds.gt_sem_seg.data = modified_mask

            image_path = os.path.join("../..", "storage", "clusters", clusterId, "versions", versionId, "images", npz_file.replace('.npz', '.jpg'))
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
            frame_queue.put(frame)

            progress = round((idx + 1) / total_frames * 100)
            yield f"data: {{\"current_image\": \"{idx}\", \"progress\": {progress}}}\n\n"
        
        # Final cleanup
        stop_event.set()
        frame_queue.join()
        torch.cuda.empty_cache()  # Clear GPU cache

    finally:
        stop_event.set()

    yield f"data: {{\"current_image\": \"Done\", \"progress\": 100}}\n\n"

from concurrent.futures import ThreadPoolExecutor, as_completed
from itertools import combinations
import os
import cv2
import mmcv
import threading
from queue import Empty, Queue
from threading import Thread
from mmseg.visualization import SegLocalVisualizer
from mmseg.apis.inference import init_model
import os.path as osp
import torch
from utils.numpy_zip import npztoseg

def renderVideo(model, clusterId, versionId, showLabel, classes):
    showLabelBool = showLabel.lower() == "true"

    # Model initialization
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

    # Processing loop
    total_frames = len(npz_files)
    selected_classes = [int(class_id) for class_id in classes.split(',')]

    try:
        for idx, npz_file in enumerate(npz_files):
            npz_path = os.path.join(segments_dir, npz_file)
            ds = npztoseg(npz_path)
            
            with torch.cuda.amp.autocast():
                pred_mask = ds.gt_sem_seg.data
            
            class_mask = torch.isin(pred_mask, torch.tensor(selected_classes, device=pred_mask.device))
            modified_mask = torch.where(class_mask, pred_mask, 255)
            ds.gt_sem_seg.data = modified_mask

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
            frame_queue.put(frame)

            progress = round((idx + 1) / total_frames * 100)
            print(progress, "'", total_frames)
        # Final cleanup
        stop_event.set()
        frame_queue.join()
    finally:
        stop_event.set()
    return

arr = [0,2,4,6,9,12,13,21,32,38,42,43,87,93,115,127]

device = 'cuda:0'
model = init_model(
    "./mmsegmentation/configs/segformer/segformer_mit-b5_8xb2-160k_ade20k-512x512.py",
    "./mmsegmentation/checkpoints/segformer/segformer_mit-b5_512x512_160k_ade20k_20210726_145235-94cedf59.pth",
    device=device)
model.half()  # Use half precision
model.eval()  # Ensure model is in evaluation mode

# Generate all possible non-empty subsets
for i in range(1, len(arr) + 1):
    for subset in combinations(arr, i):
        classes = '_'.join(map(str, subset))  # Convert numbers to string and join with "_"
        print(classes)
        cwd = os.getcwd()
        renderVideo(model, versionId="2365324a-9d62-463a-be6d-3420996993ef", clusterId="e9c1f6fd-5eac-41b9-a92d-7fd48fbda0d2", classes=classes, showLabel="true")
        
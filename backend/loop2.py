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
        # Parallel processing with ThreadPoolExecutor
        with ThreadPoolExecutor(max_workers=4) as executor:
            futures = []
            for idx, npz_file in enumerate(npz_files):
                futures.append(executor.submit(process_frame, 
                                              npz_file, 
                                              segments_dir, 
                                              clusterId, 
                                              versionId, 
                                              selected_classes,
                                              showLabelBool))
            
            for future in as_completed(futures):
                frame = future.result()
                frame_queue.put(frame)
                progress = round((len(futures) - len([f for f in futures if f.done()])) / total_frames * 100)
                print(progress, "/ 100")
        
        # Final cleanup
        stop_event.set()
        frame_queue.join()
        torch.cuda.empty_cache()
    finally:
        stop_event.set()
    return

def process_frame(npz_file, segments_dir, clusterId, versionId, selected_classes, showLabelBool):
    # Load NPZ with memory-mapped access
    npz_path = os.path.join(segments_dir, npz_file)
    ds = npztoseg(npz_path)
    
    with torch.cuda.amp.autocast():
        pred_mask = ds.gt_sem_seg.data
    
    # Class filtering
    class_mask = torch.isin(pred_mask, torch.tensor(selected_classes, device=pred_mask.device))
    modified_mask = torch.where(class_mask, pred_mask, 255)
    ds.gt_sem_seg.data = modified_mask

    # Load image
    image_path = os.path.join("..", "storage", "clusters", clusterId, "versions", versionId, "images", npz_file.replace('.npz', '.jpg'))
    image = mmcv.imread(osp.join(osp.dirname(__file__), image_path), 'color')
    image = mmcv.imresize(image, (1440, 720))

    # Visualization
    seg_local_visualizer = SegLocalVisualizer(
        vis_backends=[dict(type='LocalVisBackend')],
    )
    seg_local_visualizer.dataset_meta = model.dataset_meta
    
    seg_local_visualizer.add_datasample(
        name='frame',
        image=image,
        data_sample=ds,
        show=False,
        with_labels=showLabelBool,
    )
    return seg_local_visualizer.get_image()

arr = [1,2,4,6,9,12,13,21,32,43,68,87,93,115]

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
        classes = ','.join(map(str, subset))  # Convert numbers to string and join with "_"
        # print(classes)
        # cwd = os.getcwd()
        renderVideo(model, versionId="3e1cfa70-954f-4347-942d-78dccddb1546", clusterId="1720b249-20a0-4cc9-9206-2a543e2b2aa5", classes=classes, showLabel="true")
        
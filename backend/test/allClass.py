from mmseg.apis import init_model
from mmseg.visualization.local_visualizer import SegLocalVisualizer

model = init_model(
    "./mmsegmentation/configs/segformer/segformer_mit-b5_8xb2-160k_ade20k-512x512.py", 
    "./mmsegmentation/checkpoints/segformer/segformer_mit-b5_512x512_160k_ade20k_20210726_145235-94cedf59.pth", device='cuda:0')
dataset_meta = model.dataset_meta
seg_local_visualizer = SegLocalVisualizer(
    vis_backends=[dict(type='LocalVisBackend')]
)
seg_local_visualizer.dataset_meta = dataset_meta

print(len(dataset_meta["classes"]))
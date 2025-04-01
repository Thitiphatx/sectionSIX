import numpy as np
import torch
from mmseg.structures import SegDataSample
from mmengine.structures import PixelData


def npztoseg(filePath):
    # Memory-mapped loading for large datasets
    with np.load(filePath, mmap_mode='r') as npz_data:
        sem_seg = torch.from_numpy(npz_data['data'])  # Zero-copy conversion
        
    # Create PixelData with tensor reference
    gt_sem_seg = PixelData(data=sem_seg)
    
    # Create SegDataSample with minimal overhead
    data_sample = SegDataSample()
    data_sample.gt_sem_seg = gt_sem_seg
    
    return data_sample
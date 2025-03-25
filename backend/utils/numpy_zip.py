import numpy as np
import torch
from mmseg.structures import SegDataSample
from mmengine.structures import PixelData


def npztoseg(filePath):
    result = np.load(filePath)
    sem_seg = torch.from_numpy(result["data"])
    gt_sem_seg_data = dict(data=sem_seg)
    gt_sem_seg = PixelData(**gt_sem_seg_data)
    data_sample = SegDataSample()
    data_sample.gt_sem_seg = gt_sem_seg

    return data_sample
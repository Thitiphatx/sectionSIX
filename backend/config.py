
RESOURCE_DIR = '../resources'
RESULT_DIR = '../segmentation'

MMSEGMENTATION_DIR = 'mmsegmentation'

MODEL_LIST = {
    "pspnet_r50-d8_4xb2-40k_cityscapes-512x1024": {
        "model": "pspnet",
        "config": "pspnet_r50-d8_4xb2-40k_cityscapes-512x1024.py",
        "checkpoint": "pspnet_r50-d8_512x1024_40k_cityscapes_20200605_003338-2966598c.pth"
    },
    "deeplabv3_r18b-d8_4xb2-80k_cityscapes-512x1024": {
        "model": "deeplabv3",
        "config": "deeplabv3_r18b-d8_4xb2-80k_cityscapes-512x1024",
        "checkpoint": "deeplabv3_r18b-d8_4xb2-80k_cityscapes-512x1024__20200605_003338-2966598c.pth"
    }
}
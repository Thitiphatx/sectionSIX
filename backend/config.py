
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
        "checkpoint": "deeplabv3_r50-d8_512x1024_40k_cityscapes_20200605_022449-acadc2f8.pth"
    },
    "segformer_mit-b0_8xb1-160k_cityscapes-1024x1024": {
        "model": "segformer",
        "config": "segformer_mit-b0_8xb1-160k_cityscapes-1024x1024.py",
        "checkpoint": "segformer_mit-b0_8x1_1024x1024_160k_cityscapes_20211208_101857-e7f88502.pth"
    },
    "segformer_mit-b2_8xb2-160k_ade20k-512x512": {
        "model": "segformer",
        "config": "segformer_mit-b2_8xb2-160k_ade20k-512x512.py",
        "checkpoint": "segformer_mit-b2_512x512_160k_ade20k_20210726_112103-cbd414ac.pth"
    },
    "segformer_mit-b5_8xb2-160k_ade20k-640x640": {
        "model": "segformer",
        "config": "segformer_mit-b5_8xb2-160k_ade20k-640x640.py",
        "checkpoint": "segformer_mit-b5_640x640_160k_ade20k_20210801_121243-41d2845b.pth"
    }
}
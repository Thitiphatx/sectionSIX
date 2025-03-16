import numpy as np

result = np.load("D:/Project/section6/storage/clusters/7edb24ba-fb42-4ee8-97f7-da7fa6860b22/versions/578e3aed-6d6e-465d-bd8c-e24fb46e6675/segments/img_000000.npz")
print(result["data"].shape)
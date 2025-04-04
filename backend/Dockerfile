ARG PYTORCH="2.1.2"
ARG CUDA="12.1"
ARG CUDNN="8"
ARG MMCV="2.1.0"

FROM pytorch/pytorch:${PYTORCH}-cuda${CUDA}-cudnn${CUDNN}-devel

WORKDIR /app/backend

# Prevent interactive prompts
ENV DEBIAN_FRONTEND=noninteractive 
ENV TZ=Asia/Bangkok

# Set CUDA and PyTorch environment variables
ENV TORCH_CUDA_ARCH_LIST="6.0 6.1 7.0+PTX"
ENV TORCH_NVCC_FLAGS="-Xfatbin -compress-all"
ENV CMAKE_PREFIX_PATH="$(dirname $(which conda))/../"

RUN apt-key adv --fetch-keys https://developer.download.nvidia.com/compute/cuda/repos/ubuntu1804/x86_64/3bf863cc.pub
RUN apt-key adv --fetch-keys https://developer.download.nvidia.com/compute/machine-learning/repos/ubuntu1804/x86_64/7fa2af80.pub

# Update system and install dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    tzdata git ninja-build libglib2.0-0 libsm6 libxrender-dev libavcodec-extra libx264-dev libavformat-dev \
    libswscale-dev libxext6 libgl1-mesa-dev && \
    ln -fs /usr/share/zoneinfo/Asia/Bangkok /etc/localtime && \
    echo "Asia/Bangkok" > /etc/timezone && \
    dpkg-reconfigure -f noninteractive tzdata && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

RUN conda clean --all

RUN conda install -c conda-forge opencv

# Install MMCV (Ensure correct CUDA & PyTorch versions)
RUN pip install mmcv==2.1.0 -f https://download.openmmlab.com/mmcv/dist/cu121/torch2.1/index.html

# Copy project files
COPY . .

# Ensure CUDA is used
ENV FORCE_CUDA="1"

# Install Python dependencies
RUN pip install --default-timeout=100 -r mmsegmentation/requirements.txt
RUN pip install --no-cache-dir -e mmsegmentation/
RUN pip install flask flask_cors opencv-python-headless ffmpeg-python

# Expose Flask port
EXPOSE 5000

# Run Flask correctly
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]

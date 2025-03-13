import os
from flask import Flask, Response, request
from flask_cors import CORS
from segmentation import segment_model_list
from apis.startSegmentation import startSegmentation
from apis.render import renderVideo

app = Flask(__name__)
CORS(app)

@app.route('/api/segmentation/list', methods=['GET'])
def list_model():
    return segment_model_list()

@app.route('/api/segmentation/start', methods=['GET'])
def segmentation_start():
    model = request.args.get('model')
    clusterId = request.args.get("clusterId")
    versionId = request.args.get("versionId")

    return Response(startSegmentation(clusterId, versionId, model), content_type="text/event-stream")

@app.route('/api/segmentation/render', methods=['GET'])
def segmentation_render():
    clusterId = request.args.get("clusterId")
    versionId = request.args.get("versionId")
    showLabel = request.args.get("showLabel")
    classes = request.args.get("classes")

    return Response(renderVideo(clusterId, versionId, showLabel, classes), content_type="text/event-stream")

@app.route('/video/<path:clusterId>/<path:versionId>/<path:video>')
def stream_video(clusterId, versionId, video):
    video_path = os.path.join("..", "storage", "clusters", clusterId, "versions", versionId, "videos", video)
    print(video_path)
    # Check if the video exists
    if not os.path.exists(video_path):
        return "Video not found", 404

    # Open the video file and stream it
    def generate():
        with open(video_path, "rb") as video_file:
            while chunk := video_file.read(1024*1024):  # Read in chunks of 1MB
                yield chunk

    return Response(generate(), content_type="video/mp4")

if __name__ == '__main__':
    app.run(debug=True)

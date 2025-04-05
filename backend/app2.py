from flask import Flask, request
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

@app.route("/api/segmentation/start", methods=["GET"])
def start_segmentation():
    request.args.get("")
    return 

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
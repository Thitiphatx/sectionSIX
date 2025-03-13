
from flask import jsonify

from config import MODEL_LIST

def segment_model_list():
    return jsonify({
        'models': list(MODEL_LIST.keys())
    })
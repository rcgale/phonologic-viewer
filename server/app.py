import argparse
import dataclasses
import json
import os
import traceback
from enum import Enum
from functools import lru_cache
from io import StringIO
from typing import Mapping

import phonologic
from flask import Flask, send_from_directory, jsonify, request
from phonologic import logger
from phonologic.analysis import ComparisonFile

os.environ["PYTHONUTF8"] = "1"

SRC_DIRECTORY = os.path.dirname(os.path.abspath(__file__))
STATIC_DIRECTORY = os.path.join(SRC_DIRECTORY, "web")


def get_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", default=5000)
    parser.add_argument("--static", default=STATIC_DIRECTORY)
    return parser.parse_args()


def create_app(static_directory=STATIC_DIRECTORY):
    app = Flask(__name__, instance_relative_config=True, static_folder=static_directory)
    app.config['MAX_CONTENT_LENGTH'] = 256 * 1024 * 1024
    app.url_map.strict_slashes = False
    app.json.ensure_ascii = False

    @app.route('/api/transcripts', methods=["POST"])
    def transcripts():
        try:
            filename = request.json["filename"]
            content = StringIO(request.json["content"])

            content_errors = file_content_errors(content.getvalue())
            if content_errors:
                return jsonify({"message": f"{content_errors}"}), 400

            setattr(content, "name", filename)
            logger.info(f"Analyzing file {filename}")
            comparison_file = ComparisonFile.load(content)
            return jsonify(comparison_file)
        except Exception as e:
            traceback.print_exc()
            return jsonify({"message": f"Error processing file. {type(e).__name__}: {e}"}), 400

    @app.route('/api/analyses/<system_name>/<left>/<right>/')
    @app.route('/api/analyses/<left>/<right>/')
    def analyses(left, right, system_name="hayes-ipa-arpabet"):
        try:
            system = get_system(system_name)
            analysis_phon = system.analyze_phoneme_errors(left, right)
            analysis_feat = system.analyze_feature_errors(left, right)
            return json.dumps({
                "analysis": {
                   "features": analysis_feat,
                   "phonemes": analysis_phon,
                }
            }, default=json_handler)
        except Exception as e:
            traceback.print_exc()
            return jsonify({"message": f"{type(e).__name__}: {e}"}), 400

    @app.route('/')
    @app.route('/<path:path>')
    def index_react(path="index.html"):
        full_path = os.path.join(static, path)
        print(full_path)
        return send_from_directory(os.path.dirname(full_path), os.path.basename(full_path))

    return app


@lru_cache()
def get_system(system_name):
    return phonologic.load(system_name)


def file_content_errors(content: str):
    header, *rows = content.splitlines(keepends=False)
    sep = "\t" if "\t" in header else ","
    columns = header.split(sep)
    if len(columns) < len(set(columns)):
        return "Header has duplicate column names!"
    ids = set()
    for row in rows:
        if not row.strip():
            continue
        values = row.split(sep)
        if len(values) < 3:
            return f"Need at least three columns in row: {row}"
        id, *rest = row
        if not id or id in ids:
            return f"Invalid or repeat utterance id: `{id}`"
    return None


def json_handler(o):
    from phonologic._systems import FeatureDelta

    if isinstance(o, Enum):
        return o.name
    if isinstance(o, Mapping):
        return {key: o[key] for key in o}
    if isinstance(o, FeatureDelta):
        return {
            "left": str(o.left if o.left is not None else ""),
            "right": str(o.right if o.right is not None else ""),
            "cost": o.cost
        }
    if dataclasses.is_dataclass(o):
        return dict((field.name, getattr(o, field.name)) for field in dataclasses.fields(o))
    raise NotImplementedError(type(o))


if __name__ == '__main__':
    args = vars(get_args())
    static = args.pop("static")
    create_app(static_directory=static).run(**args)

#!/bin/bash

set -e

# env PYTHON_CONFIGURE_OPTS="--enable-framework" pyenv install 3.10.1py
python -m pip install -r requirements.txt
python -m PyInstaller -y server/app.spec

npm install
npm run build-all
npm run make
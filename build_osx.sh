#!/bin/bash

set -e

# env PYTHON_CONFIGURE_OPTS="--enable-framework" pyenv install 3.10.1py
pip install -r requirements.txt
pyinstaller -y app.spec
npm install
npm run build-all
npm run make
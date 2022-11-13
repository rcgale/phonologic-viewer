# -*- mode: python ; coding: utf-8 -*-

import os
import phonologic.systems
from PyInstaller.building.api import PYZ, EXE
from PyInstaller.building.build_main import Analysis

phono_systems_dir = os.path.dirname(phonologic.systems.__file__)

APP_NAME = "phonologic-viewer"
DATA_DIRS = [
    # "web",
    # "typescript-app/dist",
    phono_systems_dir
]

block_cipher = None

datas = [
    (os.path.join(phono_systems_dir, "*"), "phonologic/systems"),
]
for data_dir in DATA_DIRS:
    for root, dirs, files in os.walk(data_dir):
        for name in files:
            datas.append((os.path.join(root, name), root))

a = Analysis(
    ['app.py'],
    pathex=[],
    binaries=[],
    datas=datas,
    hiddenimports=[],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=True,
)
pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name=APP_NAME,
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
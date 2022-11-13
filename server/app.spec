# -*- mode: python ; coding: utf-8 -*-

import os
import phonologic.systems
from PyInstaller.building.api import PYZ, EXE
from PyInstaller.building.build_main import Analysis

phono_systems_dir = os.path.dirname(phonologic.systems.__file__)

APP_NAME = "phonologic-viewer"
DATA_DIRS = [
    (phono_systems_dir, "phonologic/systems"),
    (os.path.abspath("web"), "web"),
]

block_cipher = None

datas = []
for data_dir, dest_dir in DATA_DIRS:
    for root, dirs, files in os.walk(data_dir):
        rel_root = root.replace(data_dir.rstrip("/"), "").strip("/")
        dest_subdir = os.path.join(dest_dir, rel_root).lstrip("/")
        for name in files:
            datas.append((os.path.join(root, name), dest_subdir))
            print((os.path.join(root, name), dest_subdir))

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
    noarchive=False,
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
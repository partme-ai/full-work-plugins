#!/usr/bin/env python3
"""校验固定摘要后的 Craft ZIP 路径，再用跨平台 zipfile 解包。"""
import stat
import sys
import zipfile
from pathlib import Path, PurePosixPath

archive, destination, root_name = sys.argv[1:]
destination = Path(destination)
with zipfile.ZipFile(archive) as zipped:
    for member in zipped.infolist():
        name = member.filename
        path = PurePosixPath(name)
        if (not name or path.is_absolute() or '\\' in name or
                any(part in ('', '.', '..') for part in path.parts) or
                path.parts[0] != root_name or
                stat.S_ISLNK(member.external_attr >> 16)):
            raise ValueError('unsafe Craft release path: ' + name)
    zipped.extractall(destination)

#!/usr/bin/env python3
"""
Ribbit Image Pipeline — WebP conversion fallback.

ingest.js prefers sharp. When sharp can't load (e.g. a Linux session using the
macOS sharp binary installed next door in image-compression-workspace), it
shells out to this instead. Same output: WebP quality 78, no resize.

Usage:  python3 convert.py <src> <dest>
"""
import sys
from PIL import Image

QUALITY = 78


def main():
    if len(sys.argv) != 3:
        sys.exit("usage: convert.py <src> <dest>")
    src, dest = sys.argv[1], sys.argv[2]
    with Image.open(src) as im:
        im.save(dest, "WEBP", quality=QUALITY, method=6)


if __name__ == "__main__":
    main()

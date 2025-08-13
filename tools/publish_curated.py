#!/usr/bin/env python3
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "curated_output" / "Woodcarvings"
DEST = ROOT / "public" / "portfolio"

def main():
    if not SRC.exists():
        raise SystemExit(f"Source not found: {SRC}")
    # Clean destination
    if DEST.exists():
        shutil.rmtree(DEST)
    DEST.mkdir(parents=True, exist_ok=True)

    # Copy tree preserving structure
    for proj_dir in SRC.iterdir():
        if not proj_dir.is_dir():
            continue
        target = DEST / proj_dir.name
        shutil.copytree(proj_dir, target)
    print(f"Published curated set from {SRC} -> {DEST}")

if __name__ == "__main__":
    main()

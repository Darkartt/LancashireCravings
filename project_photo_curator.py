#!/usr/bin/env python3
"""
Project Photo Curator
=====================

Curate and sort woodcarving project photos into a clean, organized structure.

- Scans public/media/projects/<project> for process/final images (and videos optionally)
- Selects a small, representative set per project:
  * 01_RawWood (first process)
  * 02_RoughShape (~15% into process)
  * 03_DefiningForms (~40% into process)
  * 04_Detailing (~70% into process)
  * 05-09 Finished_* (up to N hero shots from final)
  * 10-11 Detail_* (optional: subset from final)
- Exports into: curated_output/Woodcarvings/<ProjectName>/ with descriptive filenames
- Creates a _Portfolio_BestOf folder with 1-2 favorites across projects
- Modes: dry-run (default), copy, move, or hardlink (if supported)

This is heuristic-only and safe. It does NOT delete originals.

Usage examples:
  python project_photo_curator.py --dry-run
  python project_photo_curator.py --mode copy --max-finals 5 --bestof-count 2

"""

from __future__ import annotations
import argparse
import json
import os
from pathlib import Path
from typing import List, Dict, Optional, Tuple
import fnmatch
import shutil
import glob

# -------- Config defaults --------
SOURCE_ROOT = Path("public/media/projects")
DEST_ROOT = Path("curated_output/Woodcarvings")
BEST_OF_DIRNAME = "_Portfolio_BestOf"
SUPPORTED_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".JPG", ".JPEG", ".PNG", ".WEBP"}
OVERRIDES_PATH = Path("curated_overrides.json")
FILTERS_PATH = Path("curated_filters.json")

# -------- Helpers --------

def list_images(folder: Path) -> List[Path]:
    files: List[Path] = []
    if not folder.exists():
        return files
    for p in sorted(folder.glob("*")):
        if p.is_file() and p.suffix in SUPPORTED_EXTS:
            files.append(p)
    return files


def pick_by_fraction(items: List[Path], frac: float) -> Optional[Path]:
    if not items:
        return None
    idx = max(0, min(len(items) - 1, int(round(frac * (len(items) - 1)))))
    return items[idx]


def spaced_picks(items: List[Path], count: int) -> List[Path]:
    if not items:
        return []
    if count >= len(items):
        return items.copy()
    out: List[Path] = []
    for i in range(count):
        frac = i / max(1, (count - 1)) if count > 1 else 0
        sel = pick_by_fraction(items, frac)
        if sel and sel not in out:
            out.append(sel)
    return out


def numeric_key_from_name(p: Path) -> int:
    """Extract trailing numeric token from filename if present (e.g., _011 -> 11)."""
    stem = p.stem
    num = ""
    for ch in reversed(stem):
        if ch.isdigit():
            num = ch + num
        else:
            if num:
                break
    try:
        return int(num) if num else 0
    except Exception:
        return 0


def load_overrides() -> Dict[str, Dict[str, str]]:
    if OVERRIDES_PATH.exists():
        try:
            import json
            with open(OVERRIDES_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, dict):
                    return data  # { projectName: { label: pattern } }
        except Exception:
            pass
    return {}


def load_filters() -> Dict[str, Dict[str, List[str]]]:
    """
    Load optional per-project filters: { projectName: { "include": [patterns], "exclude": [patterns] } }
    Patterns can be scoped with prefixes 'process:' or 'final:' or unscoped (applies to both).
    """
    if FILTERS_PATH.exists():
        try:
            with open(FILTERS_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, dict):
                    # normalize lists
                    out: Dict[str, Dict[str, List[str]]] = {}
                    for proj, cfg in data.items():
                        if not isinstance(cfg, dict):
                            continue
                        inc = cfg.get("include") or []
                        exc = cfg.get("exclude") or []
                        if isinstance(inc, list) or isinstance(exc, list):
                            out[proj] = {
                                "include": [str(x) for x in inc],
                                "exclude": [str(x) for x in exc],
                            }
                    return out
        except Exception:
            pass
    return {}


def resolve_override(project_name: str, label: str, project_dir: Path) -> Optional[Path]:
    """
    Resolve an override pattern to a source file Path.
    Pattern formats accepted:
    - "process:*_011.*" (glob, relative to images/process)
    - "final:*_301.*" (glob, relative to images/final)
    - "*_011.*" (glob searched in process first, then final)
    - "eagle_eagle_011.jpg" (filename searched in process then final)
    """
    overrides = load_overrides()
    proj_map = overrides.get(project_name) or {}
    pattern = proj_map.get(label)
    if not pattern:
        return None
    images_dir = project_dir / "images"
    process_dir = images_dir / "process"
    final_dir = images_dir / "final"

    def find_in(dir_path: Path, pat: str) -> Optional[Path]:
        for f in dir_path.glob(pat):
            if f.is_file():
                return f
        return None

    # Namespaced patterns
    if pattern.startswith("process:"):
        pat = pattern.split(":", 1)[1]
        return find_in(process_dir, pat)
    if pattern.startswith("final:"):
        pat = pattern.split(":", 1)[1]
        return find_in(final_dir, pat)

    # Unscoped: try process first then final
    p = find_in(process_dir, pattern)
    if p:
        return p
    return find_in(final_dir, pattern)


def pattern_applies_to(p: Path, pattern: str, process_dir: Path, final_dir: Path) -> bool:
    """Return True if file p matches the glob pattern. Pattern may be scoped with 'process:' or 'final:'."""
    scope = None
    pat = pattern
    if pattern.startswith("process:"):
        scope = "process"
        pat = pattern.split(":", 1)[1]
    elif pattern.startswith("final:"):
        scope = "final"
        pat = pattern.split(":", 1)[1]

    # Enforce scope
    if scope == "process" and process_dir not in p.parents:
        return False
    if scope == "final" and final_dir not in p.parents:
        return False

    # Try match against basename
    if fnmatch.fnmatch(p.name, pat):
        return True
    # Also try relative path under images
    try:
        rel = p.relative_to(process_dir if process_dir in p.parents else final_dir)
        if fnmatch.fnmatch(str(rel).replace("\\", "/"), pat):
            return True
    except Exception:
        pass
    return False


def sanitize_name(name: str) -> str:
    safe = "".join(ch if (ch.isalnum() or ch in (" ", "-", "_")) else "-" for ch in name)
    safe = " ".join(safe.split())
    return safe.strip().replace(" ", "_")


def ensure_dir(path: Path):
    path.mkdir(parents=True, exist_ok=True)


def copy_like(src: Path, dst: Path, mode: str, dry_run: bool) -> None:
    ensure_dir(dst.parent)
    if dry_run:
        return
    if mode == "move":
        shutil.move(str(src), str(dst))
    elif mode == "link":
        try:
            # Hard link if on same filesystem
            os.link(src, dst)
        except Exception:
            shutil.copy2(str(src), str(dst))
    else:
        shutil.copy2(str(src), str(dst))


# -------- Core logic --------

def curate_project(project_dir: Path, mode: str, max_finals: int, detail_count: int, dry_run: bool) -> Dict:
    project_name = project_dir.name
    images_dir = project_dir / "images"
    process_dir = images_dir / "process"
    final_dir = images_dir / "final"

    process_images = list_images(process_dir)
    final_images = list_images(final_dir)

    # Apply per-project include/exclude filters if present
    filters = load_filters()
    proj_filters = filters.get(project_name) or {}
    inc_patterns: List[str] = proj_filters.get("include") or []
    exc_patterns: List[str] = proj_filters.get("exclude") or []

    def apply_filters(files: List[Path]) -> List[Path]:
        if not files:
            return files
        # Exclude first
        filtered = [p for p in files if not any(pattern_applies_to(p, pat, process_dir, final_dir) for pat in exc_patterns)]
        # If includes specified, keep only matches
        if inc_patterns:
            filtered = [p for p in filtered if any(pattern_applies_to(p, pat, process_dir, final_dir) for pat in inc_patterns)]
        return filtered

    process_images = apply_filters(process_images)
    final_images = apply_filters(final_images)

    # Sort process images by trailing numeric to better reflect chronology
    process_images_sorted = sorted(process_images, key=numeric_key_from_name)
    final_images_sorted = final_images  # keep natural sort by name

    # Choose representatives
    # Improved phase picks
    raw = pick_by_fraction(process_images_sorted, 0.0)
    rough = pick_by_fraction(process_images_sorted, 0.18)
    defining = pick_by_fraction(process_images_sorted, 0.45)
    detailing = pick_by_fraction(process_images_sorted, 0.75)

    # Finished hero shots (spread across the set)
    hero = spaced_picks(final_images_sorted, max_finals)

    # Detail picks: naive approach, choose from mid/later portion
    detail1 = pick_by_fraction(final_images_sorted, 0.6)
    detail2 = pick_by_fraction(final_images_sorted, 0.85)
    details = []
    for d in [detail1, detail2]:
        if d and d not in hero and d not in details:
            details.append(d)
    details = details[: max(0, detail_count)]

    # Output dirs
    dest_dir = DEST_ROOT / sanitize_name(project_name)
    best_of_dir = DEST_ROOT / BEST_OF_DIRNAME

    exported: List[Tuple[str, str]] = []  # (label, curated_path)
    mapping: List[Dict[str, str]] = []    # {label, source, curated}

    # Export with naming scheme
    prefix = sanitize_name(project_name)

    # Cleanup any previous curated files for this project to avoid stale/wrong leftovers
    def cleanup_previous():
        try:
            if dest_dir.exists():
                for f in dest_dir.glob(f"{prefix}_*.*"):
                    if f.is_file() and not dry_run:
                        try:
                            f.unlink()
                        except Exception:
                            pass
            # Best Of cleanup
            ensure_dir(best_of_dir)
            for f in best_of_dir.glob(f"{prefix}_Best_*.*"):
                if f.is_file() and not dry_run:
                    try:
                        f.unlink()
                    except Exception:
                        pass
        except Exception:
            pass

    cleanup_previous()
    seq = 1

    def export_pick(p: Optional[Path], label: str):
        nonlocal seq
        if not p:
            return
        out_name = f"{prefix}_{seq:02d}_{label}{p.suffix.lower()}"
        out_path = dest_dir / out_name
        copy_like(p, out_path, mode, dry_run)
        exported.append((label, str(out_path)))
        mapping.append({"label": label, "source": str(p), "curated": str(out_path)})
        seq += 1

    # Apply overrides where specified
    ov_raw = resolve_override(project_name, "RawWood", project_dir) or raw
    ov_rough = resolve_override(project_name, "RoughShape", project_dir) or rough
    ov_defining = resolve_override(project_name, "DefiningForms", project_dir) or defining
    ov_detailing = resolve_override(project_name, "Detailing", project_dir) or detailing

    export_pick(ov_raw, "RawWood")
    export_pick(ov_rough, "RoughShape")
    export_pick(ov_defining, "DefiningForms")
    export_pick(ov_detailing, "Detailing")

    for i, h in enumerate(hero, start=1):
        ov_h = resolve_override(project_name, f"Finished_{i}", project_dir) or h
        export_pick(ov_h, f"Finished_{i}")

    for i, d in enumerate(details, start=1):
        ov_d = resolve_override(project_name, f"Detail_{i}", project_dir) or d
        export_pick(ov_d, f"Detail_{i}")

    # BestOf: pick last finished and maybe first
    best_picks: List[Path] = []
    if hero:
        best_picks.append(hero[-1])
        if len(hero) > 2:
            best_picks.append(hero[0])
    ensure_dir(best_of_dir)
    bestof_exported: List[str] = []
    for i, bp in enumerate(best_picks, start=1):
        # Allow override of best-of picks too
        ov_bp = resolve_override(project_name, f"Best_{i}", project_dir) or bp
        out_name = f"{prefix}_Best_{i}{ov_bp.suffix.lower()}"
        out_path = best_of_dir / out_name
        copy_like(ov_bp, out_path, mode, dry_run)
        bestof_exported.append(str(out_path))

    # Write per-project mapping file
    try:
        ensure_dir(dest_dir)
        with open(dest_dir / "_mapping.json", "w", encoding="utf-8") as f:
            json.dump(mapping, f, indent=2)
    except Exception:
        pass

    return {
        "project": project_name,
        "counts": {
            "process": len(process_images),
            "final": len(final_images),
            "exported": len(exported),
            "bestof": len(bestof_exported),
        },
        "exported": exported,
        "bestof": bestof_exported,
    }


def run(mode: str, max_finals: int, detail_count: int, dry_run: bool, only: Optional[List[str]] = None) -> Dict:
    ensure_dir(DEST_ROOT)
    projects = [p for p in SOURCE_ROOT.iterdir() if p.is_dir()]
    if only:
        wanted = set(n.lower() for n in only)
        projects = [p for p in projects if p.name.lower() in wanted]

    report = {"root": str(SOURCE_ROOT), "dest": str(DEST_ROOT), "mode": mode, "dry_run": dry_run, "projects": []}

    for proj in sorted(projects, key=lambda x: x.name.lower()):
        r = curate_project(proj, mode, max_finals, detail_count, dry_run)
        report["projects"].append(r)

    # Optional: curated extractions from explicit sources into new projects
    extractions_path = Path("curated_extractions.json")
    if extractions_path.exists():
        try:
            with open(extractions_path, "r", encoding="utf-8") as f:
                ex = json.load(f)
            if isinstance(ex, dict):
                for new_project, items in ex.items():
                    dest_dir = DEST_ROOT / sanitize_name(new_project)
                    ensure_dir(dest_dir)
                    prefix = sanitize_name(new_project)
                    # Clean previous curated for this virtual project
                    if not dry_run and dest_dir.exists():
                        for fpath in dest_dir.glob(f"{prefix}_*.*"):
                            try:
                                if fpath.is_file():
                                    fpath.unlink()
                            except Exception:
                                pass
                    seq = 1
                    mapping: List[Dict[str, str]] = []
                    for item in items:
                        label = item.get("label")
                        source = item.get("source")
                        if not label or not source:
                            continue
                        # Glob match absolute or workspace-relative source
                        matches: List[str] = []
                        if os.path.isabs(source):
                            matches = glob.glob(source)
                        else:
                            matches = glob.glob(str(Path(source)))
                        if not matches:
                            continue
                        src_path = Path(matches[0])
                        out_name = f"{prefix}_{seq:02d}_{label}{src_path.suffix.lower()}"
                        out_path = dest_dir / out_name
                        copy_like(src_path, out_path, mode, dry_run)
                        mapping.append({"label": label, "source": str(src_path), "curated": str(out_path)})
                        seq += 1
                    try:
                        with open(dest_dir / "_mapping.json", "w", encoding="utf-8") as mf:
                            json.dump(mapping, mf, indent=2)
                    except Exception:
                        pass
        except Exception:
            pass

    return report


def main():
    parser = argparse.ArgumentParser(description="Curate project photos into a tidy portfolio structure")
    parser.add_argument("--mode", choices=["copy", "move", "link"], default="copy", help="How to export curated files")
    parser.add_argument("--max-finals", type=int, default=5, help="Max finished hero shots to include")
    parser.add_argument("--detail-count", type=int, default=2, help="Detail close-up picks from finals")
    parser.add_argument("--dry-run", action="store_true", default=False, help="Do not copy/move, just simulate and report")
    parser.add_argument("--only", nargs="*", help="Optional subset of project folder names to process")
    parser.add_argument("--report", type=str, default="curated_report.json", help="Write a JSON report here")

    args = parser.parse_args()

    report = run(mode=args.mode, max_finals=args.max_finals, detail_count=args.detail_count, dry_run=args.dry_run, only=args.only)

    # Save report alongside DEST_ROOT
    out_path = Path(args.report)
    try:
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2)
        print(f"Report written to {out_path}")
    except Exception as e:
        print(f"Failed to write report: {e}")

    # Print compact summary
    total = len(report.get("projects", []))
    print(f"Processed projects: {total}")
    for p in report.get("projects", [])[:10]:  # show first few
        print(f"- {p['project']}: process={p['counts']['process']} final={p['counts']['final']} exported={p['counts']['exported']} bestof={p['counts']['bestof']}")
        

if __name__ == "__main__":
    main()

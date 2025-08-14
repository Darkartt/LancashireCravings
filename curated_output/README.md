Woodcarvings (Curated)
======================

This folder contains curated exports for each project, selected to tell the story from raw wood to the final piece.

Structure
- Woodcarvings/<Project>/
  - <Project>_01_RawWood.jpg
  - <Project>_02_RoughShape.jpg
  - <Project>_03_DefiningForms.jpg
  - <Project>_04_Detailing.jpg
  - <Project>_05..09_Finished_N.jpg
  - <Project>_10..11_Detail_N.jpg
- Woodcarvings/_Portfolio_BestOf/
  - <Project>_Best_1.jpg
  - <Project>_Best_2.jpg

Notes
- Originals remain untouched in public/media/projects.
- You can safely move/rename curated files as needed.
- Re-run the curator with different parameters to regenerate a set:
  - python project_photo_curator.py --mode copy --max-finals 5 --detail-count 2

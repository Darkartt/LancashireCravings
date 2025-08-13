#!/usr/bin/env python3
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CURATED = ROOT / "curated_output" / "Woodcarvings"
PUBLIC_REVIEW = ROOT / "public" / "curation-review"
OUT_HTML = PUBLIC_REVIEW / "index.html"

PROJECTS = []

for proj_dir in sorted(CURATED.iterdir() if CURATED.exists() else []):
    if not proj_dir.is_dir():
        continue
    if proj_dir.name.startswith("_"):
        # skip Best Of
        continue
    mapping_file = proj_dir / "_mapping.json"
    if not mapping_file.exists():
        continue
    try:
        data = json.loads(mapping_file.read_text(encoding="utf-8"))
    except Exception:
        continue
    items = []
    for row in data:
        label = row.get("label")
        source = row.get("source", "").replace("\\", "/")
        if not source.startswith("public/"):
            # Not web-served, skip
            continue
        url = "/" + source[len("public/"):]
        items.append({"label": label, "url": url})
    if items:
        PROJECTS.append({"name": proj_dir.name, "items": items})

PUBLIC_REVIEW.mkdir(parents=True, exist_ok=True)

def html_escape(s: str) -> str:
    return (
        s.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
        .replace("'", "&#39;")
    )

data_json = json.dumps(PROJECTS)

html = f"""<!doctype html>
<html lang=\"en\">
<head>
  <meta charset=\"utf-8\" />
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
  <title>Curated Image Review</title>
  <style>
    body {{ font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; margin: 16px; }}
    h1 {{ margin: 0 0 12px; }}
    .project {{ margin-bottom: 40px; }}
    .grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }}
    figure {{ border: 1px solid #ddd; padding: 8px; border-radius: 8px; background: #fafafa; }}
    figcaption {{ font-size: 12px; margin-top: 6px; }}
    img {{ width: 100%; height: 180px; object-fit: cover; border-radius: 4px; background: #eee; }}
    .controls {{ position: sticky; top: 0; background: #fff; padding: 8px 0; border-bottom: 1px solid #eee; margin-bottom: 16px; }}
    .badge {{ display: inline-block; background: #eef; border: 1px solid #99c; padding: 2px 6px; border-radius: 999px; font-size: 12px; margin-left: 8px; }}
    .wrong {{ outline: 3px solid #e55; }}
    .btn {{ display: inline-block; padding: 8px 12px; border: 1px solid #999; border-radius: 6px; background: #f7f7f7; cursor: pointer; margin-right: 8px; }}
  </style>
</head>
<body>
  <div class=\"controls\">
    <h1>Curated Image Review <span id=\"summary\" class=\"badge\"></span></h1>
    <button class=\"btn\" id=\"copy\">Copy wrong selections as JSON</button>
    <button class=\"btn\" id=\"reset\">Reset checks</button>
  </div>
  <div id=\"app\"></div>
  <script>
    const DATA = {data_json};
    const app = document.getElementById('app');
    const summary = document.getElementById('summary');

    function render() {{
      app.innerHTML = '';
      let wrongCount = 0;
      for (const proj of DATA) {{
        const section = document.createElement('section');
        section.className = 'project';
        const h2 = document.createElement('h2');
        h2.textContent = proj.name;
        section.appendChild(h2);
        const grid = document.createElement('div');
        grid.className = 'grid';
        for (const item of proj.items) {{
          const fig = document.createElement('figure');
          const img = document.createElement('img');
          img.loading = 'lazy';
          img.src = item.url;
          img.alt = item.label + ' - ' + item.url;

          const cap = document.createElement('figcaption');
          const cb = document.createElement('input');
          cb.type = 'checkbox';
          cb.id = proj.name + '::' + item.label;
          cb.addEventListener('change', () => {{
            if (cb.checked) {{ fig.classList.add('wrong'); wrongCount++; }}
            else {{ fig.classList.remove('wrong'); wrongCount = Math.max(0, wrongCount - 1); }}
            summary.textContent = wrongCount + ' marked wrong';
          }});
          const lab = document.createElement('label');
          lab.htmlFor = cb.id;
          lab.textContent = item.label;

          cap.appendChild(cb);
          cap.appendChild(document.createTextNode(' '));
          cap.appendChild(lab);
          cap.appendChild(document.createElement('br'));
          const small = document.createElement('small');
          small.textContent = item.url;
          cap.appendChild(small);

          fig.appendChild(img);
          fig.appendChild(cap);
          grid.appendChild(fig);
        }}
        section.appendChild(grid);
        app.appendChild(section);
      }}
      summary.textContent = wrongCount + ' marked wrong';
    }}

    render();

    document.getElementById('copy').addEventListener('click', () => {{
      const wrong = [];
      for (const proj of DATA) {{
        for (const item of proj.items) {{
          const id = proj.name + '::' + item.label;
          const cb = document.getElementById(id);
          if (cb && cb.checked) {{
            wrong.push({{ project: proj.name, label: item.label, url: item.url }});
          }}
        }}
      }}
      const text = JSON.stringify(wrong, null, 2);
      navigator.clipboard.writeText(text).then(() => {{
        alert('Copied ' + wrong.length + ' entries to clipboard.');
      }}).catch(() => {{
        prompt('Copy the JSON below:', text);
      }});
    }});

    document.getElementById('reset').addEventListener('click', () => {{
      for (const proj of DATA) {{
        for (const item of proj.items) {{
          const id = proj.name + '::' + item.label;
          const cb = document.getElementById(id);
          if (cb) cb.checked = false;
        }}
      }}
      render();
    }});
  </script>
</body>
</html>
"""

OUT_HTML.write_text(html, encoding="utf-8")
print(f"Wrote review gallery to {OUT_HTML}")

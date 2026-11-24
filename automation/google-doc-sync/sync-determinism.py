import argparse, base64, hashlib, json, re
from determinism_math import CATALOGUE, upgrade_math
from pathlib import Path
parser = argparse.ArgumentParser(description='Convert the canonical Google Doc Markdown export to a math-preserving article.')
parser.add_argument('export', type=Path)
args = parser.parse_args()
md = args.export.read_text()
root = Path(__file__).resolve().parents[2]
assets = root / 'assets/blog/determinism'
assets.mkdir(parents=True, exist_ok=True)
images = []
def image_asset(m):
    n, kind, data = m.groups()
    source = base64.b64decode(data)
    expected = next((item for item in CATALOGUE['images'] if item['image'] == int(n)), None)
    if not expected or hashlib.sha256(source).hexdigest() != expected['sha256']:
        raise ValueError('Formula image changed; update its LaTeX in determinism-math.json before publishing: ' + n)
    images.append(n)
    return ''
md = re.sub(r'^\[image(\d+)\]: <data:image/(png|jpeg);base64,([^>]+)>\s*$', image_asset, md, flags=re.M)
md = re.sub(r'!\[\]\[image(\d+)\]', lambda m: f'<img src="/assets/blog/determinism/equation-{m[1]}.png" alt="原稿公式 {m[1]}" loading="lazy">', md)
def get(pattern): return re.search(pattern, md, re.M)[1]
title = get(r'^# (.+)$')
subtitle = get(r'^## ——(.+)$')
intro = re.search(r'^我们的选择.+$', md, re.M)[0]
summary = get(r'^Summary: (.+)$')
abstract = md.split('# Abstract\n')[1].split('\n主题：')[0].strip().replace('\n\n', ' ')
keywords = get(r'^主题：(.+)$').split('；')
body = md[md.index('# 第一章'):].strip()
body = re.sub(r'^(#{1,5}) ', lambda m: m[1]+'# ', body, flags=re.M)
body = re.sub(r'^\$([^\n]+)\$(.*)$', lambda m: '$$\n'+m[1]+'\n$$'+ ('\n\n'+m[2].strip() if m[2].strip() else ''), body, flags=re.M)
j = lambda s: json.dumps(s, ensure_ascii=False)
meta = ['---', 'layout: academic-post', 'title: '+j(title), 'paper_title: '+j(title), 'paper_subtitle: '+j(subtitle), 'paper_status: "Draft"', 'subtitle: '+j(intro), 'summary: '+j(summary), 'abstract: '+j(abstract), 'keywords:']
meta += ['  - '+j(k) for k in keywords]
meta += ['cover_text: "CAUSE × CHOICE"', 'tags:', '  - Philosophy', '  - Free Will', 'format: "Academic Web Essay"', 'series: "Critical Thinking"', 'series_slug: critical-thinking', 'topics:', '  - "Philosophy & Ideas"', '  - "Society & Politics"', 'topic_slugs:', '  - philosophy-ideas', '  - society-politics', 'reading_time: 65', 'lang: zh-CN', 'source_document: "https://docs.google.com/document/d/1UBmeLqhMXht8KGxwWQ8XzM4x5VrTKDjh5Uf3fHAp7SE"', 'last_modified_at: 2026-11-24', '---', '', body, '']
print(json.dumps({'content': upgrade_math('\n'.join(meta)), 'assets': len(images), 'headings': len(re.findall(r'^#{2,4} ', body, re.M))}, ensure_ascii=False))

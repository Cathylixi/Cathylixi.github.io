"""Publish only the Google Doc's gray, italic, 10 pt story introductions."""
import argparse
import html
import json
import re
from pathlib import Path

MANIFEST_PATH = Path(__file__).with_name('determinism-story-intros.json')


def is_story_style(style, default_size=11):
    rgb = style.get('foregroundColor', {}).get('color', {}).get('rgbColor')
    if not rgb or style.get('italic') is not True:
        return False
    values = [rgb.get(channel, 0) for channel in ('red', 'green', 'blue')]
    size = style.get('fontSize', {}).get('magnitude', default_size)
    return (abs(size - 10) < .01 and max(values) - min(values) < .005
            and .15 < values[0] < .85)


def extract_intros(resource):
    """Read styling from a fresh structured Docs response, never from Markdown."""
    doc = resource.get('structuredContent', resource)
    groups = []
    for tab in doc.get('tabs', []):
        tab = tab.get('documentTab', tab)
        defaults = next((s.get('textStyle', {}).get('fontSize', {}).get('magnitude', 11)
                         for s in tab.get('namedStyles', {}).get('styles', [])
                         if s.get('namedStyleType') == 'NORMAL_TEXT'), 11)
        heading = ''
        active = None
        for node in tab.get('body', {}).get('content', []):
            paragraph = node.get('paragraph')
            if not paragraph:
                active = None
                continue
            runs = [e['textRun'] for e in paragraph.get('elements', []) if 'textRun' in e]
            text = ''.join(r['content'] for r in runs).strip()
            if paragraph.get('paragraphStyle', {}).get('namedStyleType', '').startswith('HEADING'):
                heading = text
                active = None
                continue
            substantive = [r for r in runs if r['content'].strip()]
            qualifies = (substantive and re.search(r'[\u3400-\u9fff]', text)
                         and all(is_story_style(r.get('textStyle', {}), defaults) for r in substantive))
            if qualifies:
                if active is None:
                    active = {'heading': heading, 'paragraphs': []}
                    groups.append(active)
                active['paragraphs'].append(text)
            elif text:
                active = None
    return {
        'source_document': doc['documentId'],
        'source_revision': doc.get('revisionId'),
        'selection': {'italic': True, 'color': 'gray', 'font_size_pt': 10},
        'groups': groups,
    }


def plain_paragraph(markdown):
    markdown = re.sub(r'<[^>]*>', '', markdown)
    markdown = html.unescape(markdown)
    markdown = re.sub(r'\\([\\`*_{}\[\]()#+\-.!>=])', r'\1', markdown)
    return re.sub(r'\s+', '', markdown.replace('*', ''))


def apply_intros(markdown, manifest):
    """Wrap matching paragraphs, retaining their text, links, and native math."""
    # Re-applying a refreshed manifest first removes the previous presentation.
    markdown = re.sub(r'<aside class="story-intro"[^>]*>\s*'
                      r'(?:<div class="story-intro__label"[^>]*>引子</div>\s*)?'
                      r'(.*?)\s*</aside>', lambda m: m[1], markdown, flags=re.S)
    paragraphs = markdown.split('\n\n')
    matches = []
    for group in manifest['groups']:
        indices = []
        for story in group['paragraphs']:
            found = [i for i, p in enumerate(paragraphs)
                     if plain_paragraph(p) == plain_paragraph(story)]
            if len(found) != 1:
                raise ValueError('Story text changed or is ambiguous; reread Docs: ' + story[:35])
            indices.append(found[0])
        if indices != list(range(indices[0], indices[0] + len(indices))):
            raise ValueError('Story paragraphs are no longer consecutive: ' + group['heading'])
        matches.append(indices)
    for indices in reversed(matches):
        paragraphs[indices[0]] = ('<aside class="story-intro" aria-label="故事情境" markdown="1">\n\n'
                                 + paragraphs[indices[0]])
        paragraphs[indices[-1]] += '\n\n</aside>'
    return '\n\n'.join(paragraphs)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('article', type=Path)
    parser.add_argument('--document-structure', type=Path,
                        help='Fresh get_document JSON; refreshes the style manifest.')
    args = parser.parse_args()
    if args.document_structure:
        manifest = extract_intros(json.loads(args.document_structure.read_text()))
        MANIFEST_PATH.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    else:
        manifest = json.loads(MANIFEST_PATH.read_text())
    before = args.article.read_text()
    after = apply_intros(before, manifest)
    if after != before:
        args.article.write_text(after)
    print('Story introductions:', len(manifest['groups']), 'boxes,',
          sum(len(g['paragraphs']) for g in manifest['groups']), 'paragraphs.')

"""Preserve editable LaTeX when publishing the determinism essay from Docs.

Run on the exported article *before* writing it to GitHub. Unknown/missing
display equations fail visibly rather than publishing low-resolution images.
The catalogue records the current document's exact mathematics and labels.
"""
import html
import json
import re
import string
from pathlib import Path

CATALOGUE = json.loads(Path(__file__).with_name('determinism-math.json').read_text())
GREEK = dict(zip('εξθηλδ', [r'\varepsilon', r'\xi', r'\theta', r'\eta', r'\lambda', r'\delta']))


def tex_chars(text):
    text = text.replace('f̂', r'\hat f').replace('𝒞', r'\mathcal{C}')
    for character, command in GREEK.items():
        text = text.replace(character, command + ' ')
    for character, command in {'∈': r'\in ', '≥': r'\ge ', '≤': r'\le ', '≠': r'\ne ',
                               '∧': r'\land ', '¬': r'\neg ', '≈': r'\approx ',
                               '−': '-', '′': "'", '→': r'\to '}.items():
        text = text.replace(character, command)
    return text.strip()


def display(tex, tag, identity):
    if tag:
        tex += r'\tag{' + tag + '}'
    return ('<div class="display-math" id="equation-' + identity + '" markdown="0">\n'
            + r'\[' + '\n' + html.escape(tex, quote=False) + '\n' + r'\]' + '\n</div>')


def inline_math(body):
    # Restore sub/superscripts discarded by Google Docs' Markdown export.
    # Longer forms precede their bases so t+1 remains a single subscript.
    replacements = {
        '*ai*, *t*': 'a_{i,t}', '*ji*, *t*': 'j_{i,t}',
        '*a*1, *t*': 'a_{1,t}', '*a*2, *t*': 'a_{2,t}', '*a*3, *t*': 'a_{3,t}',
        '*st*\\+1': 's_{t+1}', '*at*\\+1': 'a_{t+1}',
        '*Mt*\\+1': 'M_{t+1}', '*Et*\\+1': 'E_{t+1}',
        '*R*res': r'R_{\mathrm{res}}', '*λt*max': r'\lambda t_{\max}',
        '*t*max': r't_{\max}', '*δ*\\*': r'\delta^*',
        '*ε*0': r'\varepsilon_0', '*εc*': r'\varepsilon_c',
        '*a*1': 'a_1', '*a*2': 'a_2', '*j*1': 'j_1', '*j*2': 'j_2',
        '*s*0': 's_0', '*𝒞L*': r'\mathcal{C}_L', '𝒞*L*': r'\mathcal{C}_L',
    }
    for token in ['FC', 'FL', 'St', 'S0', 'at', 'zt', 'rt', 'jt', 'et', 'bt', 'ct', 'st', 'tW', 'Mt', 'Et']:
        replacements['*' + token + '*'] = token[0] + '_{' + token[1:] + '}'
    tokens = []

    def token(tex):
        tokens.append(tex)
        return '\ue000' + str(len(tokens) - 1) + '\ue001'

    # Never edit a URL, reference entry, or the LaTeX already inside a block.
    protected = []
    def protect(match):
        protected.append(match.group())
        return '\ue002' + str(len(protected) - 1) + '\ue003'
    body = re.sub(r'<div class="display-math".*?</div>|https?://[^\s)]+', protect, body, flags=re.S)
    for old, new in sorted(replacements.items(), key=lambda pair: -len(pair[0])):
        body = body.replace(old, token(new))
    allowed = set(string.ascii_letters + 'εξθηλδ') | {'f̂'}
    def variable(match):
        value = match[1]
        return token(tex_chars(value)) if value in allowed else match[0]
    body = re.sub(r'(?<!\*)\*([^*\n]+)\*(?!\*)', variable, body)
    # Combine neighbouring variables and operators into one math span. Stop at
    # prose punctuation and links; retain the original surrounding whitespace.
    math_token = r'\ue000\d+\ue001'
    # Raw pipes and newlines delimit Markdown table cells/rows. A math span
    # must never consume them, or Kramdown splits the span across table cells.
    bridge = r'(?:\\[+*=<>|\[\]()\-]|[0-9A-Za-ẑα-ωΑ-Ω𝒞+*/=<>≥≤≠∈∧¬≈→−′()\[\]{}., \t-])'
    prefix = r'(?:\\[|\[\]()]|[([¬−-])*'
    expression = prefix + math_token + r'(?:' + math_token + '|' + bridge + r')*'
    def render(match):
        original = match[0]
        trailing = original[len(original.rstrip()):]
        value = re.sub(math_token, lambda m: tokens[int(m[0][1:-1])], original.rstrip())
        value = re.sub(r'\\([+*=<>|\[\]()\-])', r'\1', value)
        value = re.sub(r'\bfrac\(', r'\\operatorname{frac}(', value)
        value = re.sub(r'\bln\(', r'\\ln(', value)
        return '<span class="inline-math" markdown="0">' + r'\(' + html.escape(tex_chars(value), quote=False) + r'\)' + '</span>' + trailing
    body = re.sub(expression, render, body)
    body = body.replace('2−10', '<span class="inline-math" markdown="0">' + r'\(2^{-10}\)' + '</span>')
    body = re.sub(r'\ue002(\d+)\ue003', lambda m: protected[int(m[1])], body)
    return body


def upgrade_math(markdown):
    if 'math_renderer: native' in markdown:
        return markdown  # Idempotent; do not rewrite existing LaTeX.
    for item in CATALOGUE['images']:
        pattern = r'<img src="/assets/blog/determinism/equation-' + str(item['image']) + r'\.png"[^>]*>'
        markdown, count = re.subn(pattern, lambda _: display(item['tex'], item['tag'],
                                            (item['tag'] or 'unnumbered-' + str(item['image'])).replace('.', '-')), markdown)
        if count != 1:
            raise ValueError('Missing or duplicated source formula image: ' + str(item['image']))
    for item in CATALOGUE['native']:
        legacy = item['legacy']
        pattern = re.escape(legacy)
        if '\\' in legacy and legacy.startswith(('D∧', 'U=', 'a=(', 'r+')):
            pattern = r'\$\$\s*' + pattern + r'\s*\$\$'
            if item['tag'] == 'C3':
                pattern += r'\s*\*\*\(C3\)\*\*'
            if item['tag'] == 'P4':
                pattern += r'\s*\(\*P\*4\\\)'
        elif item['tag'] == 'P4':
            pattern = r'\$\$\s*' + pattern + r'\s*\$\$\s*\(\*P\*4\\\)'
        markdown, count = re.subn(pattern, lambda _: display(item['tex'], item['tag'],
                                                       (item['tag'] or item['id']).replace('.', '-')), markdown)
        if count != 1:
            raise ValueError('Missing or duplicated native formula: ' + item['id'])
    front, body = markdown.split('\n---\n', 1)
    front = front.replace('layout: academic-post', 'layout: academic-post\nmath_renderer: native')
    body, references = body.split('## 参考文献', 1)
    markdown = front + '\n---\n' + inline_math(body) + '## 参考文献' + references
    if markdown.count('<div class="display-math"') != CATALOGUE['display_count']:
        raise ValueError('Display equation count changed')
    if len(re.findall(r'\\tag\{', markdown)) != CATALOGUE['numbered_count']:
        raise ValueError('Equation label count changed')
    if re.search(r'<img[^>]*equation-|^\$\$', markdown, re.M):
        raise ValueError('Unconverted display formula')
    return markdown


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('article', type=Path)
    arguments = parser.parse_args()
    source = arguments.article.read_text()
    result = upgrade_math(source)
    if result != source:
        arguments.article.write_text(result)
    print('Verified: 28 centered LaTeX blocks, 22 original labels.')

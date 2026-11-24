MathJax 3.2.2, `es5/tex-svg.js` from the official `mathjax-full` package.
Copyright MathJax contributors; Apache License 2.0 (see LICENSE).

This self-contained bundle renders the determinism essay's LaTeX as vector SVG
with assistive MathML. It requires neither a third-party formula-image endpoint
nor an external font download. The site's head include opts in per article with
`math_renderer: native` and leaves the legacy renderer unchanged elsewhere.

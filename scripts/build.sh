#!/bin/sh
set -e
MAINFONT="WenQuanYi Micro Hei"
MONOFONT="WenQuanYi Micro Hei Mono"

pandoc introduction.md --toc -V title="Milvus Documentation" -V author="Zilliz Inc." -V date="${_version_tag}" -V CJKmainfont="${MAINFONT}" -f markdown -o milvus.doc.pdf --pdf-engine=lualatex

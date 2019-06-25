#!/bin/bash
set -e
MAINFONT="WenQuanYi Micro Hei"
MONOFONT="WenQuanYi Micro Hei Mono"

for file in ./*
do
    if [[ $file =~ \.md$ ]]; then
        echo $file;
        pdfFile="$(basename ${file} | sed s:/:__:g).pdf";
        echo "Generating pdf: $pdfFile ..."
        pandoc $file --toc -V title="Milvus Documentation" -V author="Zilliz" -V date="${_version_tag}" -V CJKmainfont="${MAINFONT}" -f markdown -o $pdfFile --pdf-engine=lualatex;
    fi
done
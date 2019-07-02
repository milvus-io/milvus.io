#!/bin/bash
set -e
MAINFONT="WenQuanYi Micro Hei"
MONOFONT="WenQuanYi Micro Hei Mono"

for file in ./*
do
    if [[ $file =~ \.all.md$ ]]; then
        echo $file;
        pdfFile="$(basename ${file} | sed 's/\.[^.]*$//').en.pdf";
        echo "Generating pdf: $pdfFile ..."
        pandoc $file --toc -V author="Zilliz" -V geometry:margin=1in -V date="${_version_tag}" -V CJKmainfont="${MAINFONT}" -f markdown -o $pdfFile --pdf-engine=lualatex || true;
    fi
done

for file in ./zh-CN/*
do
    if [[ $file =~ \.all.md$ ]]; then
        echo $file;
        pdfFile="$(basename ${file} | sed 's/\.[^.]*$//').zh-CN.pdf";
        echo "Generating cn pdf: $pdfFile ..."
        pandoc $file --toc  -V author="Zilliz" -V geometry:margin=1in -V date="${_version_tag}" -V CJKmainfont="${MAINFONT}" -f markdown -o $pdfFile --pdf-engine=lualatex || true;
    fi
done
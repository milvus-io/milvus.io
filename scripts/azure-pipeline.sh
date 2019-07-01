#!/bin/sh
node merge.js userguide
node merge.js vectordb
node merge.js zh-CN/userguide zh-CN
node merge.js zh-CN/vectordb zh-CN
docker run --rm -v `pwd`:/workspace shanghaikid/pandoc /workspace/build.sh
#!/bin/sh
node merge.js userguide
node merge.js vectordb
node merge.js zh-CN/userguide
node merge.js zh-CN/vectordb
docker run --rm -v `pwd`:/workspace shanghaikid/pandoc /workspace/build.sh
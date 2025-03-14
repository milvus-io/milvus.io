#!/bin/bash

nginx -g "daemon on;"

cd app/

npx next start -p 3000
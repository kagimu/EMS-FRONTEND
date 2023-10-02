#!/bin/bash

echo "\n * Starting...\n * build the latest source code"
echo "\n * Pulling code updates\n"
git pull
docker build -t wholesome-ui .
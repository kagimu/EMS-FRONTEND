#!/bin/bash

echo "\n * Starting...\n * build the latest source code"
echo "\n * Pulling code updates\n"
git pull
docker build -t wholesome-ui .

echo "\n * change directory one step up and run docker-compose\n"

cd /home/docker_apps/

docker-compose up -d
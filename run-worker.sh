#!/bin/bash

set -ex

sudo docker build -t thepatrick/meetupsencoder-worker -f Dockerfile.worker .
sudo docker run --rm -it --env REDIS_HOST=10.244.67.2 -v `pwd`/storage:`pwd`/storage thepatrick/meetupsencoder-worker
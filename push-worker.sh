#!/bin/bash

set -ex

sudo docker build -t thepatrick/meetupsencoder-worker -f Dockerfile.worker .
sudo docker push thepatrick/meetupsencoder-worker:latest
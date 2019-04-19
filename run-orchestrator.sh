#!/bin/bash

sudo docker build -t thepatrick/meetupsencoder-orchestrator -f Dockerfile.orchestrator .
sudo docker run --rm -it --env REDIS_HOST=10.244.67.2 -p 8181:8181 thepatrick/meetupsencoder-orchestrator
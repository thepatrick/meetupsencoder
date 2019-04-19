#!/bin/bash

sudo docker build -t thepatrick/meetupsencoder-orchestrator -f Dockerfile.orchestrator .
sudo docker push thepatrick/meeetupsencoder-orchestrator:latest
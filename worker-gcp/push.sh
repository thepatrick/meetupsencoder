#!/bin/bash

set -uex

sudo docker build -t thepatrick/melt -f Dockerfile .
sudo docker push thepatrick/melt:latest

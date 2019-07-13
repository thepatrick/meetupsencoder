#!/bin/bash

npm run build
env GOOGLE_APPLICATION_CREDENTIALS=`pwd`/gcloud.json npm start
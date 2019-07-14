#!/bin/bash

npm run build

export GOOGLE_APPLICATION_CREDENTIALS=`pwd`/gcloud.json
export PGDATABASE=postgres
export PGHOST=localhost
export PGPORT=5433
export PGUSER=postgres
export PGPASSWORD=p@ssw0rd42

npm run initdb
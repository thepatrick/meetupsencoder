#!/bin/bash


export GOOGLE_APPLICATION_CREDENTIALS=`pwd`/gcloud.json
export GOOGLE_STORAGE_BUCKET=video.twopats.live
export PGDATABASE=postgres
export PGHOST=localhost
export PGPORT=5433
export PGUSER=postgres
export PGPASSWORD=p@ssw0rd42
export PORT=8080
export ME_SECRET="foddE%cLFDU0yhm8r1G@D*m7vmO&nR%szPJy03P0xjO0yrTR"
export ME_SELF_URL=http://localhost:${PORT}

npm run watch | ./node_modules/.bin/pino-pretty
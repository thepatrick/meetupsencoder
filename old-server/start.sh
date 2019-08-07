#!/usr/bin/env bash

set -e
set -u

. /keybase/private/thepatrick/mw-envs.sh

yarn build
yarn start

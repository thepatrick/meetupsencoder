FROM node:10.16.0-stretch-slim

RUN apt-get update \
  && apt-get install --assume-yes \
  frei0r-plugins \
  libdlrestrictions1 \
  libgavl1 \
  libkdecore5 \
  libmlt++3 \
  libmlt-data \
  libmlt6 \
  libqt4-svg \
  libquicktime2 \
  libsox-fmt-alsa \
  libsox-fmt-base \
  libsox2 \
  melt \
  openshot-doc \
  python-httplib2 \
  python-mlt

WORKDIR /opt/twopats.live/encoder

COPY . /opt/twopats.live/encoder

RUN apt-get install --assume-yes --no-install-recommends build-essential \
  && npm install \
  && npm run build \
  && rm -rf node_modules \
  && npm install --production \
  && rm -rf src \
  && apt-get purge -y --auto-remove build-essential

ENTRYPOINT [ "node", "dist/index.js" ]

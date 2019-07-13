FROM node:12.6.0-stretch-slim as builder

WORKDIR /opt/twopats.live/encoder

COPY . /opt/twopats.live/encoder

RUN npm install \
  && npm run build \
  && rm -rf node_modules \
  && npm install --production \
  && rm -rf src

FROM google/cloud-sdk:252.0.0-slim

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

COPY --from=builder /usr/local /usr/local

COPY --from=builder /opt/twopats.live/encoder /opt/twopats.live/encoder

WORKDIR /opt/twopats.live/encoder

ENTRYPOINT [ "node", "dist/index.js" ]

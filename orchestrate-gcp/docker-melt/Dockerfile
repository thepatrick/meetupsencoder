FROM node:10-stretch

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

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENTRYPOINT [ "/usr/bin/melt" ]

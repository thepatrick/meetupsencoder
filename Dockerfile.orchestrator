FROM node:10-stretch

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV NODE_ENV production
COPY package.json /usr/src/app/
RUN npm install && npm cache clean --force
COPY . /usr/src/app

CMD [ "npm", "run", "orchestrator" ]

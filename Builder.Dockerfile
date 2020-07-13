# => Build container
FROM mhart/alpine-node:14 as builder
WORKDIR /site
COPY package.json .
COPY yarn.lock .
RUN yarn install --production && yarn cache clean

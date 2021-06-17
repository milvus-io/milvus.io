# => Build container
FROM node:14.16.0-buster as builder
WORKDIR /site
COPY package.json .
COPY yarn.lock .
RUN yarn install --production && yarn cache clean

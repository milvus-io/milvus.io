# => Build container
FROM node:14.16.0-buster as builder
WORKDIR /site
COPY package.json .
# RUN sudo apt-get install autoconf
RUN yarn install --production && yarn cache clean

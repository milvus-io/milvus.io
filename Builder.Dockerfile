# => Build container
FROM mhart/alpine-node:14 as builder
WORKDIR /site
COPY . .
RUN yarn install --production && yarn cache clean

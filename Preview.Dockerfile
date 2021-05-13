# => Build container
# FROM zilliz/milvus.io.builder as builder
FROM node:14.16.0-buster as builder
WORKDIR /site
ENV IS_PREVIEW preview

COPY . .
RUN yarn install --production && yarn cache clean

RUN yarn build

# => Run container
FROM nginx:1.17-alpine

# Nginx config
RUN rm -rf /etc/nginx/conf.d
COPY conf /etc/nginx

# Static build
COPY --from=builder /site/public /usr/share/nginx/html/

# Default port exposure
EXPOSE 80

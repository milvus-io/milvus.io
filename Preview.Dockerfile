# => Build container
# FROM zilliz/milvus.io.builder as builder
FROM node:14.15.3-alpine3.12 as builder
WORKDIR /app
ENV IS_PREVIEW preview

COPY . .
RUN yarn

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

# => Build container
FROM node:13-buster as builder
ARG IS_PREVIEW 
ENV IS_PREVIEW $IS_PREVIEW
WORKDIR /site
COPY package.json .
COPY yarn.lock .
RUN yarn
COPY . .

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

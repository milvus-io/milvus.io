FROM node:18 AS base
WORKDIR /app

COPY . /app/

# => Run container
FROM zilliz/zilliz-web-runner

RUN apk add --no-cache bash
RUN npm install -g next
RUN rm -rf /etc/nginx/conf.d/default.conf

COPY conf/conf.d /etc/nginx/conf.d

COPY . /app/
EXPOSE 80

CMD ["/bin/sh", "/app/bin/start.sh"]

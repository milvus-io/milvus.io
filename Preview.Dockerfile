# => Build container
FROM milvusdb/milvus.io.builder:preview as builder
ENV GITHUB_TOKEN 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
WORKDIR /site
ENV IS_PREVIEW preview

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

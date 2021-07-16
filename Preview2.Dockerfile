# => Build container
FROM milvusdb/milvus.io.builder:preview as builder
WORKDIR /site
ENV IS_PREVIEW preview

COPY . .

RUN yarn build

# => Run container
FROM netroby/alpine-rsync
ARG RSYNC_PASSWORD
ARG PREVIEW_SITE

COPY --from=builder /site/public /tmp/public

RUN echo $RSYNC_PASSWORD > rsync.pass
RUN chmod 600 rsync.pass
RUN chown root rsync.pass
RUN cat rsync.pass
RUN rsync --password-file=rsync.pass -rDvpzc --delete /tmp/public rsync://$PREVIEW_SITE


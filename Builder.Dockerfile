FROM node:22-alpine3.24 AS base
WORKDIR /app

RUN npm install -g pnpm@10.33.0

FROM base AS dependency
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile --prefer-offline \
 && pnpm store prune \
 && rm -rf /root/.pnpm-store

FROM dependency AS builder
ARG REPO_STATICS_KEY
ARG INKEEP_API_KEY
ARG MSERVICE_URL
ARG CMS_BASE_URL

COPY src ./src
COPY public ./public
COPY content ./content
COPY scripts ./scripts
COPY next.config.js next-env.d.ts sitemap.config.js ./
COPY tsconfig.json typings.d.ts ./
COPY .prettierrc tailwind.config.js postcss.config.js components.json ./
RUN pnpm build --env=REPO_STATICS_KEY=$REPO_STATICS_KEY --env=INKEEP_API_KEY=$INKEEP_API_KEY --env=MSERVICE_URL=$MSERVICE_URL --env=CMS_BASE_URL=$CMS_BASE_URL

# On-demand rendering reads only markdown/json/mdx from src/docs at runtime.
# Image assets live under */assets and were already migrated to public during
# build, so drop them here to keep the runtime src/docs layer small.
RUN find src/docs -type f \( \
      -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.gif' \
      -o -iname '*.svg' -o -iname '*.webp' -o -iname '*.avif' -o -iname '*.ico' \
      -o -iname '*.mp4' -o -iname '*.mov' -o -iname '*.webm' \
    \) -delete

# Preserve the existing Nginx configuration and GeoIP database from a fixed snapshot.
FROM zilliz/zilliz-web-runner@sha256:baa1f93c18b2ba2646ee451a8c3da37918dd43be8107eb870092cc4c0459622d AS nginx-config

FROM base AS nginx-runtime
RUN apk add --no-cache bash supervisor 'nginx>=1.30.7' \
      nginx-mod-http-geoip2 nginx-mod-http-headers-more \
 && mkdir -p /var/log/supervisor \
 && rm -f /etc/nginx/http.d/default.conf

COPY --from=nginx-config /etc/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=nginx-config /etc/nginx/conf.d/geoip2.conf /etc/nginx/conf.d/dbip-country-lite.mmdb /etc/nginx/conf.d/
COPY conf/conf.d /etc/nginx/conf.d
COPY supervisord.conf /etc/supervisord.conf
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
 && ln -sf /dev/stderr /var/log/nginx/error.log \
 && nginx -v \
 && nginx -t

FROM nginx-runtime AS runner
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/src/blogs /app/src/blogs
# Doc and api-reference pages are rendered on demand (blocking fallback), so the
# server reads markdown from src/docs at runtime. Without this, on-demand pages
# would 500 with ENOENT.
COPY --from=builder /app/src/docs /app/src/docs
COPY --from=builder /app/public /app/public
COPY --from=builder /app/content /app/content
COPY --from=builder /app/global-stats.json /app/global-stats.json
COPY --from=dependency /app/node_modules /app/node_modules

EXPOSE 80

# Run supervisor
CMD ["supervisord", "-c", "/etc/supervisord.conf"]

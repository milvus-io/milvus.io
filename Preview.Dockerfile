FROM node:22-alpine3.24 AS node-base
WORKDIR /app

FROM node-base AS pnpm-base
RUN npm install -g pnpm@10.33.0

FROM pnpm-base AS dependency
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --prefer-offline --frozen-lockfile \
 && pnpm store prune \
 && rm -rf /root/.pnpm-store

FROM pnpm-base AS prod-dependency
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
# Install only runtime dependencies and drop build-only compiler binaries,
# source maps, and TypeScript declarations that next start never reads.
# Provide a temporary no-op husky shim so root `prepare` succeeds without
# devDependencies while keeping package.json's `prepare` strict on dev hosts.
RUN mkdir -p /tmp/prod-bin && printf '#!/bin/sh\nexit 0\n' > /tmp/prod-bin/husky && chmod +x /tmp/prod-bin/husky \
 && PATH="/tmp/prod-bin:$PATH" pnpm install --prod --prefer-offline --frozen-lockfile \
 && rm -rf /tmp/prod-bin \
 && pnpm store prune \
 && rm -rf /root/.pnpm-store \
 && rm -rf node_modules/.pnpm/@next+swc-* node_modules/@next/swc-* \
      node_modules/.pnpm/typescript@* node_modules/.pnpm/playwright*@* \
      node_modules/.pnpm/@playwright+* \
 && find node_modules -type f \( \
      -name '*.map' -o -name '*.d.ts' -o -name '*.d.mts' -o -name '*.d.cts' \
    \) -delete

FROM dependency AS builder
# Turbopack's parallel compilation is faster with jemalloc on Alpine.
RUN apk add --no-cache jemalloc
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
# Match CI pre-build cleanup so local Docker builds also omit retired v0-v2.1 docs/assets.
RUN rm -rf src/docs/localization/v2.0.x src/docs/localization/v2.1.x \
      src/docs/v0.x src/docs/v1.1.1 src/docs/v2.0.x src/docs/v2.1.x \
 && LD_PRELOAD=/usr/lib/libjemalloc.so.2 pnpm build --env=REPO_STATICS_KEY=$REPO_STATICS_KEY --env=INKEEP_API_KEY=$INKEEP_API_KEY --env=MSERVICE_URL=$MSERVICE_URL --env=CMS_BASE_URL=$CMS_BASE_URL

# The runner already ships node_modules and the content trees. Drop standalone
# trace manifests, build caches, type stubs, and source maps unused by next start.
RUN find .next -type f \( -name '*.nft.json' -o -name '*.map' \) -delete \
 && rm -rf .next/cache .next/trace .next/types

# On-demand rendering reads only markdown/json/mdx from src/docs at runtime.
# Drop migrated media assets, build-only tooling/scripts, and retired doc
# directories without page routes. Keep src/docs/API_Reference intact so
# archived SDK /_next/data requests continue resolving cleanly.
RUN find src/docs -type f \( \
      -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.gif' \
      -o -iname '*.svg' -o -iname '*.webp' -o -iname '*.avif' -o -iname '*.ico' \
      -o -iname '*.mp4' -o -iname '*.mov' -o -iname '*.webm' \
    \) -delete \
 && rm -rf \
      src/docs/scripts src/docs/preview src/docs/test \
      src/docs/community src/docs/tools \
      src/docs/.skills src/docs/.github src/docs/.claude \
      src/docs/.codex src/docs/.opencode \
      src/docs/localization/v2.3.x src/docs/v2.2.x src/docs/v2.3.x

# Blog image assets were already migrated into public/blogs during build, and
# meetup/repo metadata directories are never read at runtime.
RUN rm -rf src/blogs/blog/assets src/blogs/meetup src/blogs/.github src/blogs/.git

# Hardlink byte-identical static files (mostly doc images duplicated across
# versions) so Docker/OCI tar layers store each unique payload only once.
RUN node scripts/dedupe-public-assets.js public

# Preserve the existing Nginx configuration and GeoIP database from a fixed snapshot.
FROM zilliz/zilliz-web-runner@sha256:baa1f93c18b2ba2646ee451a8c3da37918dd43be8107eb870092cc4c0459622d AS nginx-config

FROM node-base AS nginx-runtime
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
COPY --from=prod-dependency /app/node_modules /app/node_modules

EXPOSE 80

# Run supervisor
CMD ["supervisord", "-c", "/etc/supervisord.conf"]

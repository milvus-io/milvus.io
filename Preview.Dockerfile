FROM node:22-alpine AS base
WORKDIR /app

RUN npm install -g pnpm@10.33.0


ARG REPO_STATICS_KEY
ARG INKEEP_API_KEY
ARG MSERVICE_URL
ARG CMS_BASE_URL

FROM base AS dependency
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --prefer-offline --frozen-lockfile

FROM dependency AS builder
COPY src ./src
COPY public ./public
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

# => Run container
FROM zilliz/zilliz-web-runner

RUN apk add --no-cache bash
RUN npm install -g next

# Install supervisor
RUN apk add --no-cache bash supervisor

# Create supervisor log directory
RUN mkdir -p /var/log/supervisor
RUN rm -rf /etc/nginx/conf.d/default.conf

COPY conf/conf.d /etc/nginx/conf.d
COPY supervisord.conf /etc/supervisord.conf

COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/src/blogs /app/src/blogs
# Doc and api-reference pages are rendered on demand (blocking fallback), so the
# server reads markdown from src/docs at runtime. Without this, on-demand pages
# would 500 with ENOENT.
COPY --from=builder /app/src/docs /app/src/docs
COPY --from=builder /app/public /app/public
COPY --from=builder /app/global-stats.json /app/global-stats.json
COPY --from=dependency /app/node_modules /app/node_modules

EXPOSE 80

# Run supervisor
CMD ["supervisord", "-c", "/etc/supervisord.conf"]

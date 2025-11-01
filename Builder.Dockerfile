FROM node:22-slim AS base
WORKDIR /app

RUN npm install -g pnpm

ARG REPO_STATICS_KEY
ARG INKEEP_API_KEY
ARG MSERVICE_URL
ARG CMS_BASE_URL

FROM base AS dependency
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile --prefer-offline \
 && pnpm store prune \
 && rm -rf /root/.pnpm-store

FROM dependency AS builder
COPY src ./src
COPY public ./public
COPY scripts ./scripts
COPY next.config.js next-env.d.ts sitemap.config.js ./
COPY tsconfig.json typings.d.ts ./
COPY .prettierrc tailwind.config.js postcss.config.js components.json ./
RUN pnpm build --env=REPO_STATICS_KEY=$REPO_STATICS_KEY --env=INKEEP_API_KEY=$INKEEP_API_KEY --env=MSERVICE_URL=$MSERVICE_URL --env=CMS_BASE_URL=$CMS_BASE_URL

# => Run container
FROM zilliz/zilliz-web-runner

RUN apk add --no-cache bash
RUN npm install -g next
RUN rm -rf /etc/nginx/conf.d/default.conf

COPY conf/conf.d /etc/nginx/conf.d
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/src/blogs /app/src/blogs
COPY --from=builder /app/public /app/public
COPY --from=builder /app/global-stats.json /app/global-stats.json
COPY --from=dependency /app/node_modules /app/node_modules
COPY bin/start.sh /app/bin/

EXPOSE 80

CMD ["/bin/sh", "/app/bin/start.sh"]

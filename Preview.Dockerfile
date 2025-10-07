FROM node:18-alpine AS base
WORKDIR /app

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN apk add --no-cache git

ARG REPO_STATICS_KEY
ARG INKEEP_API_KEY
ARG MSERVICE_URL
ARG CMS_BASE_URL
ARG IS_PREVIEW

FROM base AS dependency
# Copy only package files first for better caching
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --prefer-offline --frozen-lockfile --prod=false

FROM dependency AS builder
# Copy source files in order of change frequency (least to most)
COPY tsconfig.json typings.d.ts ./
COPY .prettierrc tailwind.config.js postcss.config.js components.json ./
COPY next.config.js next-env.d.ts sitemap.config.js ./
COPY scripts ./scripts
COPY public ./public
COPY src ./src

# Build with optimizations
RUN pnpm build --env=REPO_STATICS_KEY=$REPO_STATICS_KEY --env=INKEEP_API_KEY=$INKEEP_API_KEY --env=MSERVICE_URL=$MSERVICE_URL --env=CMS_BASE_URL=$CMS_BASE_URL --env=IS_PREVIEW=$IS_PREVIEW

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

FROM node:18 AS base
WORKDIR /app

RUN npm install -g pnpm

ARG MSERVICE_URL
ARG CMS_BASE_URL
ARG REPO_STATICS_KEY
ARG INKEEP_API_KEY
ARG INKEEP_INTEGRATION_ID
ARG INKEEP_ORGANIZATION_ID

# must add prefix NEXT_PUBLIC if use it in browser
ENV MSERVICE_URL=$MSERVICE_URL
ENV CMS_BASE_URL=$CMS_BASE_URL
ENV NEXT_PUBLIC_REPO_STATICS_KEY=$REPO_STATICS_KEY
ENV NEXT_PUBLIC_INKEEP_API_KEY=$INKEEP_API_KEY
ENV NEXT_PUBLIC_INKEEP_INTEGRATION_ID=$INKEEP_INTEGRATION_ID
ENV NEXT_PUBLIC_INKEEP_ORGANIZATION_ID=$INKEEP_ORGANIZATION_ID

FROM base AS dependency
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --prefer-offline --frozen-lockfile

FROM dependency AS builder
COPY src ./src
COPY public ./public
COPY scripts ./scripts
COPY next.config.js next-env.d.ts sitemap.config.js ./
COPY tsconfig.json typings.d.ts ./
COPY .prettierrc tailwind.config.js postcss.config.js components.json ./
RUN pnpm build

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

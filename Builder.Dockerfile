FROM node:18 as builder
WORKDIR /app
COPY . .

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

# install pnpm
RUN npm install -g pnpm

# install node modules
RUN pnpm install
# build nextjs
RUN pnpm build

# => Run container
FROM anroe/nginx-geoip2:1.22.1-alpine-geoip2-3.4

# Nginx config
RUN rm -rf /etc/nginx/conf.d
COPY conf /etc/nginx

# Static build
COPY --from=builder /app/out /usr/share/nginx/html/

# Default port exposure
EXPOSE 80

# Add bash
RUN apk add --no-cache bash

# Start Nginx server
CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]

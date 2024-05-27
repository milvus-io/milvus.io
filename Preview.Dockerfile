FROM node:18 as builder
WORKDIR /app
COPY . .

ARG MSERVICE_URL
ARG CMS_BASE_URL
ARG REPO_STATICS_KEY
ARG INKEEP_API_KEY
ARG INKEEP_INTEGRATION_ID
ARG INKEEP_ORGANIZATION_ID
ARG IS_PREVIEW

ENV MSERVICE_URL=$MSERVICE_URL
ENV CMS_BASE_URL=$CMS_BASE_URL
ENV REPO_STATICS_KEY=$REPO_STATICS_KEY
ENV INKEEP_API_KEY=$INKEEP_API_KEY
ENV INKEEP_INTEGRATION_ID=$INKEEP_INTEGRATION_ID
ENV INKEEP_ORGANIZATION_ID=$INKEEP_ORGANIZATION_ID
ENV IS_PREVIEW=$IS_PREVIEW

# install node modules
RUN pnpm install
# build nextjs
RUN pnpm build

# => Run container
FROM nginx:1.17-alpine

# Nginx config
RUN rm -rf /etc/nginx/conf.d
COPY conf-preview /etc/nginx

# Static build
COPY --from=builder /app/out /usr/share/nginx/html/

# Default port exposure
EXPOSE 80

# Add bash
RUN apk add --no-cache bash

# Start Nginx server
CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]

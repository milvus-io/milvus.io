FROM node:18 as builder
WORKDIR /app
COPY . .
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

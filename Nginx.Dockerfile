FROM anroe/nginx-geoip2:1.22.1-alpine-geoip2-3.4

# Replace the default conf.d folder with your local configuration
RUN rm -rf /etc/nginx/conf.d
COPY conf /etc/nginx

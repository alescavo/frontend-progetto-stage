# Fase di build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Fase di produzione
FROM nginxinc/nginx-unprivileged:1.25-alpine

# Crea tutte le directory necessarie con permessi corretti
RUN mkdir -p /var/cache/nginx/client_temp /var/cache/nginx/proxy_temp /var/cache/nginx/uwsgi_temp && \
    chmod -R 755 /var/cache/nginx && \
    chown -R nginx:root /var/cache/nginx

# Configurazione Nginx per OpenShift
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia i file buildati con permessi corretti
COPY --from=builder --chown=nginx:root /app/dist /usr/share/nginx/html

# Fix permessi finali
RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]

# Fase di build ottimizzata per Vite
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Fase di produzione con permessi per OpenShift
FROM nginx:alpine

# Crea directory necessarie e imposta permessi
RUN mkdir -p /var/cache/nginx/client_temp /var/cache/nginx/proxy_temp && \
    chmod -R 755 /var/cache/nginx /var/run /var/log/nginx && \
    chown -R nginx:root /var/cache/nginx

# Configurazione specifica per Vite
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia i file buildati con permessi corretti
COPY --from=builder --chown=nginx:root /app/dist /usr/share/nginx/html

# Fix permessi finali
RUN chmod -R 755 /usr/share/nginx/html

# Porta richiesta da OpenShift
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

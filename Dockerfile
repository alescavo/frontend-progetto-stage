# Fase di build
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Fase di produzione
FROM nginx:1.25-alpine

# Crea directory necessarie con permessi corretti
RUN mkdir -p /var/cache/nginx/client_temp && \
    mkdir -p /var/run && \
    chmod -R g+rwx /var/cache/nginx && \
    chmod -R g+rwx /var/run && \
    chmod -R g+rwx /etc/nginx && \
    chown -R nginx:root /usr/share/nginx/html

# Configurazione Nginx personalizzata
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx-cache.conf /etc/nginx/nginx.conf

# Copia i file buildati
COPY --from=builder --chown=nginx:root /app/dist /usr/share/nginx/html

# Esponi la porta 8080
EXPOSE 8080

# Avvia Nginx come utente non-root
USER nginx
CMD ["nginx", "-g", "daemon off;"]

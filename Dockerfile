# Fase di build
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

# Fase di produzione
FROM nginx:1.25-alpine

# Crea tutte le directory necessarie con permessi corretti
RUN mkdir -p /var/cache/nginx/client_temp /var/cache/nginx/proxy_temp && \
    chmod -R 755 /var/cache/nginx && \
    chown -R nginx:root /var/cache/nginx

# Rimuove la configurazione di default
RUN rm /etc/nginx/conf.d/default.conf

# Copia la configurazione personalizzata
COPY nginx.conf /etc/nginx/conf.d/

# Copia i file buildati
COPY --from=builder --chown=nginx:root /app/dist /usr/share/nginx/html

# Imposta permessi finali
RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 8080

# Avvia Nginx senza user directive
CMD ["nginx", "-g", "daemon off;"]

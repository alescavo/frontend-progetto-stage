# Fase di build
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

# Fase di produzione
FROM nginx:alpine

# Crea directory necessarie con permessi corretti
RUN mkdir -p /var/cache/nginx/client_temp && \
    chmod -R 755 /var/cache/nginx && \
    chown -R nginx:nginx /var/cache/nginx

# Rimuove la direttiva 'user' dalla configurazione base
RUN sed -i '/user  nginx;/d' /etc/nginx/nginx.conf

# Copia i file buildati
COPY --from=builder /app/dist /usr/share/nginx/html

# Configurazione Nginx ottimizzata per OpenShift
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Fix permessi finali per OpenShift
RUN chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]

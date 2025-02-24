# Fase di build
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Fase di produzione
FROM nginx:1.25-alpine

# Copia i file generati dalla fase di build
COPY --from=builder /app/dist /usr/share/nginx/html

# Configurazione Nginx personalizzata per React Router e OpenShift
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Fix permessi per OpenShift (Random UID)
RUN chmod -R g+rwX,o+rwX /usr/share/nginx/html && \
    chmod -R g+rwX /var/cache/nginx && \
    chmod -R g+rwX /etc/nginx/ && \
    chmod -R g+rwX /var/run

# Esponi la porta 8080 (richiesto da OpenShift)
EXPOSE 8080

# Avvia Nginx
CMD ["nginx", "-g", "daemon off;"]

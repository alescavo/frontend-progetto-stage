FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.25-alpine

# Copia i file con struttura corretta
COPY --from=builder /app/dist /usr/share/nginx/html

# Configurazione Nginx ottimizzata per asset statici
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Fix permessi specifico per CSS/asset
RUN chmod -R a+r /usr/share/nginx/html && \
    find /usr/share/nginx/html -type d -exec chmod a+rx {} \;

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]

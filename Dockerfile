# Fase di build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Fase di produzione
FROM nginxinc/nginx-unprivileged:1.25-alpine

# Configurazione Nginx per OpenShift
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia i file buildati nella posizione corretta
COPY --from=builder /app/dist /usr/share/nginx/html

# Non sono necessari comandi di chmod/chown
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]

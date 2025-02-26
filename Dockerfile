# Fase di build
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

# Fase di produzione
FROM nginx:alpine

# Copia tutti i file dalla cartella dist di Vite
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia la configurazione Nginx (se necessaria)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]

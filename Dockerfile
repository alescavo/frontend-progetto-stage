# Stage 1: Build dell'app con Node.js 20 e Vite
FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build

# Stage 2: Servizio con Nginx e configurazione personalizzata
FROM nginx:1.25-alpine
# Rimuove i file di default e imposta i permessi
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html
# Copia la configurazione personalizzata di Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Imposta utente non-root
RUN chown -R nginx:nginx /usr/share/nginx/html
USER nginx
# Healthcheck e avvio
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

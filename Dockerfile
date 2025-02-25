# Stage 2: Servizio con Nginx e configurazione personalizzata
FROM nginx:1.25-alpine

# 1. Crea directory necessarie e imposta permessi PRIMA di cambiare utente
RUN mkdir -p /var/cache/nginx/client_temp && \
    chown -R nginx:nginx /var/cache/nginx && \
    chmod -R 755 /var/cache/nginx

# 2. Rimuove i file di default
RUN rm -rf /usr/share/nginx/html/*

# 3. Copia contenuti statici
COPY --from=builder /app/dist /usr/share/nginx/html

# 4. Copia configurazione Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 5. Imposta permessi cartella contenuti statici
RUN chown -R nginx:nginx /usr/share/nginx/html

# 6. Cambio utente (deve essere l'ultima operazione prima del CMD)
USER nginx

# 7. Healthcheck e avvio
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

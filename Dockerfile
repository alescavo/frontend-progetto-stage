# Stage 1: Build dell'app con Node e Vite
FROM node:16-alpine as builder
WORKDIR /app
# Copia i file di configurazione per installare le dipendenze
COPY package*.json ./
RUN npm install
# Copia il resto del codice sorgente
COPY . .
# Esegue il build dell'app, che per Vite di default genera la cartella "dist"
RUN npm run build

# Stage 2: Servizio con Nginx
FROM nginx:alpine
# Rimuove il contenuto di default di Nginx
RUN rm -rf /usr/share/nginx/html/*
# Copia la build generata dal builder nella cartella di default di Nginx
COPY --from=builder /app/dist /usr/share/nginx/html
# Espone la porta 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

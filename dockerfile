# Base image olarak Node.js'in resmi imajını kullan
FROM node:14

# Çalışma dizinini ayarla
WORKDIR /app

# package.json ve package-lock.json dosyalarını çalışma dizinine kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Uygulama kodunu çalışma dizinine kopyala
COPY . .

# Uygulamanın çalışacağı portu belirt
EXPOSE 3000

# Sunucuyu başlat
CMD ["node", "server.js"]

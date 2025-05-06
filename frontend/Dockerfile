FROM node:20-alpine

WORKDIR /app

# Copiar arquivos de configuração primeiro para aproveitar o cache das camadas
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o resto dos arquivos
COPY . .

# Expor porta
EXPOSE 5173

# Comando para iniciar o servidor de desenvolvimento
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"] 
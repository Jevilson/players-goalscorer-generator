# Use a imagem base do Node.js
FROM node:16-alpine

# Defina o diretório de trabalho
WORKDIR /usr/src/app

# Copie os arquivos package.json e package-lock.json (ou yarn.lock)
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Copie o restante do código da aplicação
COPY . .

# Exponha a porta que a aplicação usará
EXPOSE 3000

# Defina o comando para iniciar a aplicação
CMD ["node", "server.js"]

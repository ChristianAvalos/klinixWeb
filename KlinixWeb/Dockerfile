# Etapa de build
FROM node:20-alpine AS build

WORKDIR /app

# Asegura que se instalen devDependencies (vite) y que npm cree binarios en node_modules/.bin
ENV NODE_ENV=development \
	NPM_CONFIG_PRODUCTION=false \
	NPM_CONFIG_BIN_LINKS=true

# Instala dependencias (incluye devDependencies como vite) de forma determinística
COPY package.json package-lock.json ./
RUN npm ci --include=dev

# Copia el resto del proyecto y compila
COPY . .

# Falla temprano con un error claro si vite no quedó disponible
RUN test -e node_modules/.bin/vite

# Ejecuta Vite sin depender de PATH ni de cómo npm inyecte node_modules/.bin
RUN node ./node_modules/vite/bin/vite.js build

# Etapa final: usar "serve" para servir el contenido estático de Vite
FROM node:20-alpine

WORKDIR /app

# Instalar "serve" globalmente
RUN npm install -g serve

# Copiar el resultado del build
COPY --from=build /app/dist .

# Exponer el puerto 3000 (o el que quieras)
EXPOSE 3000

# Comando para servir
CMD ["serve", "-s", ".", "-l", "3000"]

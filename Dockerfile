# --- Etapa de Build ---
# Esta etapa instala todas las dependencias, incluyendo las de desarrollo
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copia los archivos de definición de paquetes
COPY package*.json ./

# Instala todas las dependencias
RUN npm install

# --- Etapa de Producción ---
# Esta es la imagen final, más ligera y segura
FROM node:18-alpine

WORKDIR /usr/src/app

# Crea un usuario no-root para ejecutar la aplicación por seguridad
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copia solo las dependencias de producción desde la etapa 'builder'
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copia el código fuente de la aplicación
COPY src/ ./src

# Copia el archivo de entrada principal que está en la raíz
COPY index.js ./

# Asigna la propiedad de los archivos al usuario no-root
RUN chown -R appuser:appgroup .
USER appuser

# Expone el puerto en el que corre la aplicación (tomado de tu .env.example)
EXPOSE 3001

# Comando para iniciar la aplicación desde la raíz del WORKDIR
CMD [ "node", "index.js" ]
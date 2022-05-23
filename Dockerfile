FROM node:13-alpine
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm install -g @ionic/cli
RUN npm install --production
CMD ["ionic", "serve"]
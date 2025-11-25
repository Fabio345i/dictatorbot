FROM node:22-alpine

RUN apt-get update && apt-get install -y ffmpeg

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

CMD ["npm", "start"]

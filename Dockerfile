FROM node:22-alpine

# Install FFmpeg and bash (optional but useful)
RUN apk add --no-cache ffmpeg bash

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the rest of the project
COPY . .

# Start the bot
CMD ["npm", "start"]

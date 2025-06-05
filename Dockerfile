# Multi-stage: build client + serve with Node.js backend
FROM node:18 AS builder

# Build frontend
WORKDIR /app/client
COPY client/package.json client/vite.config.js ./
COPY client/src ./src
COPY client/index.html ./
RUN npm install && npm run build

# Backend stage
FROM node:18

WORKDIR /app
COPY server /app/server
COPY --from=builder /app/client/dist /app/client/dist

WORKDIR /app/server
RUN npm install

ENV PORT=3001
EXPOSE 3001

CMD ["npm", "run", "dev"]

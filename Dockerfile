FROM node:22-bookworm-slim
WORKDIR /app
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build && \
    mkdir -p .next/standalone/.next && \
    cp -r .next/static .next/standalone/.next/static

EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]

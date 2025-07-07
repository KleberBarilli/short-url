FROM node:22.17.0

WORKDIR /app

RUN npm install -g @nestjs/cli prisma

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

EXPOSE 3333

CMD ["sh", "-c", "npx prisma generate && npm run start:dev"]
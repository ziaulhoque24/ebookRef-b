FROM node:20

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci

COPY . .

# Generate the Prisma client
RUN npm run prisma:generate

RUN npm run build

ENV NODE_ENV=production

EXPOSE 4001

CMD ["node", "dist/src/index.js"]
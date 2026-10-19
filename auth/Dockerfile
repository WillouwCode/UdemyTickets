FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install --omit=dev

COPY tsconfig.json .
COPY src ./src

CMD ["npm", "start"]
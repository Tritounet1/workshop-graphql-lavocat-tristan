FROM node:18-slim

WORKDIR /api

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . ./

EXPOSE 5050

CMD ["npm", "run", "dev"]

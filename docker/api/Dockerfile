FROM node:18-slim

WORKDIR /api

COPY package*.json ./

RUN npm install

COPY . ./

EXPOSE 5050

CMD ["npm", "run", "dev"]

FROM node:20.9.0-bullseye-slim

LABEL version="1.0"
LABEL description="Docker image for the SmoothSail Manager app"

ENV NODE_ENV production

WORKDIR /app

COPY package*.json .

RUN npm install

USER node

COPY . .

EXPOSE 3000

CMD npm start

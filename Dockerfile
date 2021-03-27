FROM node:10.24.0-stretch

WORKDIR /app
COPY ./package.json .
COPY ./package-lock.json .
COPY ./index.js .
COPY ./getWaterInfo.js .
COPY ./getChatId.js .
COPY ./.env.example .

RUN npm install

ENTRYPOINT npm start

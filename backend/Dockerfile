FROM node:8.10

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g nodemon

EXPOSE 3000

CMD nodemon server
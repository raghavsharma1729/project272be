FROM node:latest

WORKDIR /usr/src/Backend

COPY package*.json ./

RUN npm install
# RUN npm install --save pg sequelize sequelize-cli

# COPY . .

EXPOSE 5000
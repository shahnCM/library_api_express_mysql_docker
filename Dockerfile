FROM node:14-slim

# Create app directory
WORKDIR /usr/src/library_api

# COPY ./package*.json ./
COPY ./package*.json ./

# Install Packages
RUN npm i -g npm@latest

# Installing npm packages
RUN npm install

# Bundle app source
COPY . .

# RUN npm run db-migrate-fresh

EXPOSE 5000
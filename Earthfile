VERSION 0.6

test-runner:
    # Get the base image of Node version 16
    FROM node:16

    # Get the latest version of Playwright
    FROM mcr.microsoft.com/playwright:focal
    
    # Set the work directory for the application
    WORKDIR /app
    
    # Set the environment path to node_modules/.bin
    ENV PATH /app/node_modules/.bin:$PATH

    # Get the needed libraries to run Playwright
    RUN apt-get update && apt-get -y install libnss3 libatk-bridge2.0-0 libdrm-dev libxkbcommon-dev libgbm-dev libasound-dev libatspi2.0-0 libxshmfence-dev

    # COPY the needed files to the app folder in Docker image
    COPY ./wait-for-it.sh /app/
    COPY package.json /app/

    # Install the dependencies in Node environment
    RUN yarn install --ignore-scripts

    COPY tests/ /app/tests/
    COPY config.toml /app/

    CMD ./wait-for-it.sh -t 0 shopify:9292 && yarn test
    SAVE IMAGE --push test-runner:latest

shopify:
    FROM ruby:3.2-alpine

    RUN apk update && apk add nodejs git npm bash curl gcc g++ make

    RUN npm install -g @shopify/cli @shopify/theme

    WORKDIR /theme

    COPY . .

    EXPOSE 9292
    CMD ["shopify", "theme", "dev", "--live-reload", "full-page"]
    SAVE IMAGE --push shopify:latest

build:
    BUILD +test-runner
    BUILD +shopify


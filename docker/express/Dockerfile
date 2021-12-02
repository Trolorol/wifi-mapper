FROM node:latest
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
RUN git clone https://github.com/Trolorol/wifi-mapper.git .
ENV PATH /usr/src/app/node_modules/.bin:$PATH
RUN npm install
run npm start




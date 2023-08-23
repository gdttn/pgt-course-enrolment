FROM node:18-alpine3.17 as build-deps

WORKDIR /csa_backend

COPY ./package.json . 
COPY ./package-lock.json .

RUN npm install
# RUN npm install pm2@latest -g
RUN npm install nodemon -g
COPY . .

EXPOSE 3001

# CMD ["pm2", "start", "./src/server.js"]
CMD ["nodemon", "./src/server.js"]
FROM node:18-alpine3.17 as build-deps
WORKDIR /csa_frontend
COPY ./package.json . 
COPY ./package-lock.json .
RUN npm install
COPY . .
RUN npm run build

# nginx block
FROM nginx:1.24-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build-deps /csa_frontend/dist .
ENTRYPOINT [ "nginx", "-g", "daemon off;"]

EXPOSE 80
FROM node:18-alpine as builder

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .

RUN yarn install

FROM node:18-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app
COPY  --from=builder /usr/src/app/package.json ./package.json
COPY  --from=builder /usr/src/app/node_modules ./node_modules

COPY . .

EXPOSE 80

CMD yarn run build && yarn next start -p 80

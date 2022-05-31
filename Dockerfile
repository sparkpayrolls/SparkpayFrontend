FROM node:14.19-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json .
COPY node_modules ./node_modules
COPY .next ./.next
COPY public ./public

EXPOSE 80

CMD [ "npx", "next", "start", "-p", "80"]

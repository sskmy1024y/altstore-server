FROM node:16.4.0-alpine AS base

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
RUN yarn


# Build For Dev
FROM node:16.4.0-alpine AS dev

ENV NODE_ENV=development

RUN apk update && apk add unzip

WORKDIR /app
COPY --from=base /app/node_modules ./node_modules

EXPOSE 3000

CMD ["yarn", "dev"]

# Build For Production
FROM node:16.4.0-alpine AS builder

ENV NODE_ENV=production

WORKDIR /app
COPY ./src .
COPY --from=base /app/node_modules ./node_modules
RUN yarn build

EXPOSE 3000

CMD [ "yarn", "start" ]

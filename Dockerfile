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
FROM node:16.4.0-alpine AS build

ENV NODE_ENV=production

WORKDIR /app
COPY . .
COPY .env .
COPY --from=base /app/node_modules ./node_modules

RUN yarn build

# Production
FROM node:16.4.0-alpine AS production

ENV NODE_ENV=production

RUN apk update && apk add unzip

WORKDIR /app
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/yarn.lock ./yarn.lock
COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public
COPY --from=build /app/.env .

RUN yarn

EXPOSE 3000

CMD [ "yarn", "serve" ]

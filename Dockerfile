FROM node:14.17.6-alpine

WORKDIR /petal

COPY package*.json ./
COPY yarn.lock ./
RUN yarn install --immutable --immutable-cache --check-cache

RUN yarn global add pm2

COPY . .
RUN yarn build

EXPOSE 6379

CMD ["yarn", "pm2"]
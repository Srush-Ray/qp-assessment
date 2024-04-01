FROM node:18
WORKDIR /app
COPY package*.json ./
RUN yarn
COPY . .
RUN yarn run build
CMD [ "yarn", "run", "start:dev" ]
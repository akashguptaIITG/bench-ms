FROM node:12-alpine3.11
WORKDIR /app/aggregator-api
COPY package.json /app/aggregator-api
RUN npm install
COPY . /app/aggregator-api
EXPOSE 7003
# Launch application
CMD ["npm","start"]
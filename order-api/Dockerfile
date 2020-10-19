FROM node:12-alpine3.11
WORKDIR /app/order-api
COPY package.json /app/order-api
RUN npm install
COPY . /app/order-api
EXPOSE 7002
# Launch application
CMD ["npm","start"]
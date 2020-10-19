FROM node:12-alpine3.11
WORKDIR /app/user-api
COPY package.json /app/user-api
RUN npm install
COPY . /app/user-api
EXPOSE 7001
# Launch application
CMD ["npm","start"]
# bench-microservices

Microservices architechture based on Kubernetes

# Running the micro service localy

- Run docker-compose up -d (make sure ports are free)

- Microservice identified:

1. user-api: Responsible for user-management
2. order-api: Resposible for order management
3. aggregator-api: Responsible for aggregation of logs an data from user-api and order-api load balanced

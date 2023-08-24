# Example of async microservices communication using Rabbitmq and nestjs

## Run locally

Install dependencies
```bash
yarn install
```

Run database, rabbitmq and minio using docker-compose

```bash
docker-compose up db rabbitmq minio createbuckets
```

Build all dependencies and microservices
```bash
yarn build-all
```

Run microservice `api`
```bash
yarn api start
```

Run microservice `worker`
```bash
yarn worker start
```

## Run in docker
```bash
docker-compose up
```

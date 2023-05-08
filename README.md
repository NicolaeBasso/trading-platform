<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description
### Node.js framework - NestJS:
[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.
### Python framework:
https://flask.palletsprojects.com/en/2.2.x/
## Installation and running from root

```bash
In first terminal (core api service):
$ npm run core:startup

In second terminal (user frontend):
$ npm run dashboard:startup
```

## Prerequisites

### Run database via Docker compose

docker-compose up -d --build

### Prisma

#### Generate migration:

npx prisma migrate dev --name <name-of-new-migration>

#### Migrate (run on host or in docker container for docker setup):

npx prisma migrate dev

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Documentation (Swagger OpenAPI)
### Dashboard frontend:
localhost:3333
### Core service:
localhost:5555/api
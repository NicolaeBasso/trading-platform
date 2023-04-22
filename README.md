<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description
### Node.js framework - NestJS:
[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.
### Python framework:
https://flask.palletsprojects.com/en/2.2.x/
## Installation

```bash
$ npm install
```

## Running the app

```

### Single command core service and deps startup:
$ npm run startup:dev:local

```

```bash
# development
docker compose up -d --build mongo1 mongo2 mongo3
# wait for mongo containers to finish starting, then:
./startdb.sh
# after shell script positive response, run all the other contaienrs with:
docker compose up -d --build
# $ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
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
### Auth service:
localhost:5000/api
### Core service:
localhost:5100/api

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

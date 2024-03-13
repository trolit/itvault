## About

itvault is utility to **store source code knowledge** (what each part of code is used for). It relies on simple mechanism - coloring file content. In short, user defines blueprints that represent elements used to mark code. Such coloring not only keeps knowledge of code but allows to **generate new project base with only selected blueprints**.

> Please note that this app is not completed (but is in advanced stage). If you would like to use it I'd suggest to take backend and create own frontend (client) or just take parts that interest you 🤔

## Stack

|                                                                                                    Backend                                                                                                    |                                  Frontend                                   |
| :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------: |
|                                                                                               TypeScript 4.9.5                                                                                                |                              TypeScript 4.7.4                               |
|                                                                                                Node.js v18.17                                                                                                 |                                    Vue 3                                    |
| Docker, Docker Compose, Express, TypeORM, winston, tsyringe, Mocha (nyc, chai, sinon, supertest, testcontainers), AWS S3 (LocalStack), Redis, RabbitMQ, Engine.io, mustache, nodemailer, formidable, yup, JWT | Vite, Pinia, vee-validate + yup, apexcharts, PostCSS, markdown-it, Naive UI |

## Running

## Testing

### Unit tests

```sh
npm run test:unit
```

### Integration tests

```sh
# NODE_ENV=test
npm run testcontainers:up
npm run db:setup
npm run test:integration
npm run testcontainers:down
```

### E2E tests

```sh
# NODE_ENV=test
npm run testcontainers:up
npm run db:setup
npm run test:e2e
npm run testcontainers:down
```

## Features

- store files locally or in cloud
- [role] - [permission] granular access system
- global chat with configurable depth
- mail system with mustache and nodemailer
- hybrid API versioning (branch ✅, query ✅, leaf ⛔)
- real-time client-server communication with Engine.io
- workspace insights
- strong typing (e.g. schema <-> controller relation)

Plus sessions management, seeders (via typeorm-extension), hybrid authentication - half on user (JWT), half on server (Redis)

## To consider

- create modular variant of project
- preview users of specific role
- mobile variant of client
- create separate app for management
- finish real-time communication events
- listen to releases pull requests (develop -> main) and then create new variants according to PR data
- check if there is option to train AI of workspace code to determine which parts refer to which blueprint
- edit file content while keeping all colorings structure at the same time
- ability to preview few lines of version when reviewing files for Bundle generation
- job that removes files if they do not have entry in database
- monitor status of each endpoint
- define "parent" permission (can't update children permissions if parent is disabled)
- Workspace - Files tab - rename/delete directory
- Workspace - Files tab - icons matching file extension

## Relevant posts

- Granular permissions (TODO)
- Hybrid API versioning (TODO)
- TypeORM or something different (TODO)
- Integration tests "Probata" API (TODO)
- [Composition API - try or not to try](https://trolit.github.io/posts/vue-x-composition-api-try-or-not-to-try)
- [Client-server communication using Engine.io](https://trolit.github.io/posts/realtime-client-server-communication-using-engineio)

## Links

- https://vuejs.org/api/sfc-script-setup.html
- [Node.js x TypeScript target mapping](https://github.com/microsoft/TypeScript/wiki/Node-Target-Mapping)
- [Customize Vite config](https://vitejs.dev/config/)
- alternative to "module-alias" (taken from [Kehrlann](https://github.com/Kehrlann/module-alias-74))

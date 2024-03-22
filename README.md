<em>
Memory is the mother of all wisdom.<br/>
-Aeschylus
</em>

<br/>
<br/>

itvault is "projects vault" made to 1) keep what each part of code is used for and 2) extract selected parts on demand. It relies on simple mechanism - coloring file content. Permitted user(s) create **blueprints** - abstract elements used to mark code and then users with access benefit from that knowledge.

> Although app is in advanced stage (took 1+ year), it's not completed. If you would like to use it, I'd suggest to take out backend as Composition API was taken to experiment with new approach and it still needs big refactoring (I see potential - after working out with form submit - but still prefer Options API).

## Stack

- Schema validation: yup
- Client-Server real-time communication: Engine.io

<details>
<summary>Backend</summary>

- TypeScript: 4.9
- Node: v18.17
- Web framework: Express.js
- ORM framework: TypeORM
- Logger: winston
- DI: tsyringe
- Tests: Mocha (nyc, chai, sinon, supertest, testcontainers)
- File storage: local or AWS S3 (simulated with LocalStack)
- Secondary DB (store for sessions/roles): Redis
- Queues: RabbitMQ
- Mailing: mustache (renderer), nodemailer (sender), maildev (local testing)
- Authentication: currently hybrid, half on server (Redis), half on client (JWT)

</details>

<details>

<summary>Frontend</summary>

- TypeScript: 4.7
- Framework: Vue 3 (experimenting with Composition API)
- Store: Pinia
- Components library: Naive UI
- Forms: vee-validate (+yup)
- Charts: apexcharts
- CSS: PostCSS
- E2E tests: Cypress

</details>

## Running

### Development

1.  Install dependencies (`npm install`).
2.  Create `.env` files from `.env.example`.
3.  Initialize docker containers from `backend` dir.

    ```sh
    npm run dc:dev:start
    ```

4.  Prepare database (migrations, seeders).

    ```sh
    npm run db:setup
    ```

5.  Start backend.

    ```sh
    npm run dev
    ```

    \*To handle bundle generation & mail sending, run queues:

    ```sh
    npm run queues:dev
    ```

6.  Start frontend.

    ```sh
    npm run dev
    ```

    ```sh
    # Super user (all permissions)
    email: head.admin@itvault.dev
    password: 1234

    # Member
    email: member@itvault.dev
    password: 1234
    ```

Note that default setup uses local files storage. To check out AWS S3 (through LocalStack):

1. Stop backend.
2. Set `FILES_STORAGE_MODE` env variable to `aws`.
3. Start LocalStack.

   ```sh
   npm run dc:localstack:start
   ```

4. Get `awslocal` tool and setup bucket (check [README](./backend/README.md)).
5. Start backend (`npm run dev`).
6. Upload some files to see effect:

```
awslocal s3api list-objects --bucket itvault-bucket
{
    "Contents": [
        {
            "Key": "workspace-6/b6a66d7d95ad9b2b585dc0700.txt",
            "LastModified": "2024-03-22T10:40:19.000Z",
            "ETag": "\"02003d02d9dab50aead91ee0ddad97ed\"",
            "Size": 710,
            "StorageClass": "STANDARD",
            "Owner": {
                "DisplayName": "webfile",
                "ID": "75aa57f09aa0c8caeab4f8c24e99d10f8e7faeebf76c078efc7c6caea54ba06a"
            }
        }
    ],
    "RequestCharged": null
}
```

Disclaimers:

\*Files created through seeders won't be reachable.

\*When running free version of LocalStack, data is not persistent.

### Production

1. Initialize docker containers from `backend` dir.

   ```sh
   npm run dc:prod:start
   ```

2. Set `NODE_ENV` to `production` in `backend`.
3. Prepare database (migrations, seeders).

   ```sh
   npm run db:setup
   ```

4. Create super user account manually or create [production](./backend/src/db/seeds/production/) seeder.

5. Start backend.

   ```sh
   npm run prod
   ```

   \*To handle bundle generation & mail sending, run queues:

   ```sh
   npm run queues:prod
   ```

## Testing

### Unit tests

```sh
npm run test:unit
```

### Integration tests

```sh
# NODE_ENV=test
npm run testcontainers:up
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

## To consider/To do

- rework all "ids" to UUID not only to improve security but simplify integration tests
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

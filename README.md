# suite-booking-backend

### One-time configuration

Install `node_modules` using command: `npm install`

<details>
    <summary>Webstorm configuration</summary>

> NOTE: Follow this if you are using Webstorm to run the project.

Because we use Typescript, we need to compile .ts files into .js in the ./dist directory.

> Enable "Recompile on changes" feature in File > Settings > Languages & Frameworks > Typescript.

Open project in WebStorm > Add/Edit Configuration > click (+) button > select `NodeJs` configuration

> * Name: `app`
> * Node Interpreter: Dropdown to select `Project node (/usr/bin/node)`
> * Node Parameters: `--require ts-node/register -r tsconfig-paths/register`
> * Working Directory: `~/<PATH>/suite-booking-backend`
> * Javascript File: Browse to `index.ts`
> * Add new before-launch command > Compile Typescript > Select `tsconfig.json` file

</details>

### Run the app:

Simply run the command: `npm run start`

<details>
    <summary>NPM Commands List</summary>

* **start**: `npm run start` - will simply start running our backend.
* **dev**: `npm run dev` - will run our backend in dev mode.
* **build**: `npm run build` - build our project in `./dist` directory.
* **clean**: `npm run clean` - deletes `./dist` directory.
* **integration-test**: `npm run integration-test` runs integration tests.

</details>

### Run tests

#### Integration test

Simply run the command: `npm run integration-test`

<details>
    <summary>Webstorm configuration</summary>

Open project in WebStorm > Add/Edit Configuration > click (+) button > select `Mocha` configuration

> * Name: `integration-test`
> * Node Interpreter: Dropdown to select `Project node (/usr/bin/node)`
> * Working Directory: `~/<PATH>/suite-booking-backend`
> * Mocha Package: select `~/<PROJECT_PATH>/suite-booking-backend/node_modules/mocha`
> * User Interface: select `bdd`
> * Extra Mocha Options: `--require ts-node/register -r tsconfig-paths/register`
> * Test Directory Options: Select `Test File` > Browse to select `~/<PATH>/suite-booking-backend/integration-test/index.ts`
> * Add new before-launch command > Compile Typescript > Select `tsconfig.json` file

</details>

## Environment Variables

The app reads `.env.local` file to load environment variables in `process.env`. Following are the variables:

* `DATABASE_NAME`: specify name of the database.

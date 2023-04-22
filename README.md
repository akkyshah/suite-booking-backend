# suite-booking-backend

## Setup

### One-time configuration

Install `node_modules` using command: `npm install`

<details>
    <summary><b>Webstorm configuration</b></summary>

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

### How to run:

Simply run the command: `npm run start`

<details>
    <summary><b>NPM Commands List</b></summary>

* **Start**: `npm run start` - will simply start running our backend.
* **Dev**: `npm run dev` - will run our backend in dev mode.
* **Build**: `npm run build` - build our project in `./dist` directory.
* **Clean**: `npm run clean` - deletes `./dist` directory.

</details>

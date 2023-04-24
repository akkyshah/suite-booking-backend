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

Simply run the command: `npm run integration-test`.<br/><br/>
These tests covers all happy paths of all the endpoints. It also covers some of edge-cases of our business logic.

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

#### Unit test

Simply run the command: `npm run unit-test`

<details>
    <summary>Webstorm configuration</summary>

Open project in WebStorm > Add/Edit Configuration > click (+) button > select `Mocha` configuration

> * Name: `unit-test`
> * Node Interpreter: Dropdown to select `Project node (/usr/bin/node)`
> * Working Directory: `~/<PATH>/suite-booking-backend`
> * Mocha Package: select `~/<PROJECT_PATH>/suite-booking-backend/node_modules/mocha`
> * User Interface: select `bdd`
> * Extra Mocha Options: `--require ts-node/register -r tsconfig-paths/register`
> * Test Directory Options: Select `Test File` > Browse to select `~/<PATH>/suite-booking-backend/unit-test/index.ts`
> * Add new before-launch command > Compile Typescript > Select `tsconfig.json` file

</details>

## Environment Variables

The app reads `.env.local` file to load environment variables in `process.env`. Following are the variables:

* `DEVELOPMENT_MODE`: true/false to enable/disable development mode. Currently we are using the value only to allow CORS.
* `SERVER_PORT`: Used to specify server port. currently set to `8081`.
* `LOG_LEVEL`: used to specify log-level. Currently it is set to `debug`.
* `DATABASE_NAME`: specify name of the database.

## Endpoints

<details>
<summary><b><i>GET /api/heath/check</i></b></summary>

Used to check if server is running and healthy. It will respond `200 OK` if it is running.
</details>

<br/>

<details>
<summary><b><i>POST /api/booking</i></b></summary>

Used to create a booking. The request body must contain following data:

```
email: string
firstName: string
lastName: string
noOfGuests number (min: 1 | max: 3)
startDate: YYYY-MM-DD (must be at least +24-hours future date | must be less than 30 days from current-date)
endDate: YYYY-MM-DD (must be greater than startDate | must be less than equal to +3 days from startDate)
```

Response:

```
200 OK
{bookingId: string, status: "booked"}
```

This `bookingId` can be used to get booking information, make changes in booking information or to cancel a booking.
</details>

<br/>

<details>
<summary><b><i>GET /api/booking/{bookingId}</i></b></summary>

Used to fetch information of a booking by passing `bookingId` in the request param.

Sample Response:

```
200 OK
{
  email: string
  firstName: string
  lastName: string
  noOfGuests: number
  startDate: YYYY-MM-DD
  endDate: YYYY-MM-DD
  status: "booked" or "cancelled"
}
```

</details>

<br/>

<details>
<summary><b><i>GET /api/booking</i></b></summary>

Used to fetch information regarding availability of the presidential suite.
You could also pass `startDate` and `endDate` parameter in request query to fetch availability within a given range.
Make sure that the difference between startDate and endDate should be minimum 1 day and max 3 days.

Sample Request:

```
GET /api/booking?startDate=2023-01-20&endDate=2023-01-22
```

Response:

```
200 OK
[{
  from: YYYY-MM-DD,
  to: YYYY-MM-DD
}, {
  from: YYYY-MM-DD,
  to: YYYY-MM-DD
}, ...]
```

</details>

<br/>

<details>
<summary><b><i>PATCH /api/booking/{bookingId}</i></b></summary>

Used to update a booking. You must pass `bookingId` in request url as param and JSON in the request-body to specify attributes to update.

Request URL:

```
PATCH /api/booking/{bookingId}
```

Request Body (all params are optional, but need to pass at least 1 param):

```
{
  firstName: string,
  lastName: string,
  email: string,
  noOfGuests: string,
  startDate: YYYY-MM-DD,
  endDate: YYYY-MM-DD,
}
```

Response:

```
200 OK
[{
  from: YYYY-MM-DD,
  to: YYYY-MM-DD
}, {
  from: YYYY-MM-DD,
  to: YYYY-MM-DD
}, ...]
```

</details>

<br/>

<details>
<summary><b><i>PATCH /api/booking/cancel/{bookingId}</i></b></summary>

Used to cancel a booking. You must pass `bookingId` in request url as param.

Request URL:

```
PATCH /api/booking/cancel/{bookingId}
```

Response:

```
200 OK
{success: true}
```

</details>

## Project Information

* Language: **TypeScript**
* Database: **sqlite**
* Server: **Express**
* Middlewares:
    * **bodyParser**: To parse request to JSON.
    * **cors**: To control cross-origin access
    * **handle404**: Custom middleware - to respond status code `404` if provided a URL that does not exist.
    * **errorHandler**: Custom middleware - to respond with appropriate `errCode` and `message` when there occurs any runtime error.
    * **asyncQueue**: Custom middleware that takes the request and run into an `async` queue where concurrency is set to 1.
* Logging: Using `winston` for logging. It can later be easily configured to connect to datadog.

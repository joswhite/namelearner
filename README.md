## NameLearner

### Directory Structure

dist
- **data** - images and json downloaded from lds.org
- **images** - images used in app
- **vendor** - libraries included in app
- **controllers, models, routes.js, setup, server.js** - javascript compiled from src  
- **app.ng.js, app.ng.js.map** - angular app 

src
- **app** - angular app
- **controllers** - REST API endpoints
- **models** - Mongoose interaction with database
- **routes.ts** - App routes
- **setup** - scripts to download lds.org data and add to database
- **server.ts** - Server start script 

### REST API

#### Request

- If applicable, body contains the object to insert, or an array of objects

#### Response

- If error, status code is 4xx or 5xx and body is an error message (string)
- Otherwise, status code is 2xx and body is an object or an array of objects
related to the request


### Set up

#### Build
Run the following commands
1. `npm install`
2. `npm run build`

#### Setup Development Environment
Run the following commands
1. `npm install`
2. `npm start`
3. `npm test` (optional)

#### Useful commands
* `npm run build` Starts a production build
* `npm start` Starts the development environment, which watches your 
system for any file changes and rebuilds automatically. It also serves
the dist/ folder from http://localhost:4000/
* `npm run clean` Cleans dist/ directory
* `npm test` Starts test environment, which will watch your system for 
any file changes, rebuild your code, and run unit tests
* `npm run test-single-run` Builds the code and runs all unit tests a
one time



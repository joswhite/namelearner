# NameLearner

Learn the names of those in your organization. Written by Joseph White, 2016-2017. Unauthorized use prohibited.

### Directory Structure

dist/
- dist/client includes HTML assets and **app.bundle.js** (bundle of all src/client code).
  HTML assets include favicon.ico, images/, and vendor/ (all in root, except images is in assets/)
- dist/server and dist/setup are mirrors of these directories in src/

src/client/
- **images** - images used in app
- **vendor** - libraries included in app
- **app.bundle.js, app.bundle.js.map** - angular app

src/server/
- **controllers** - REST API endpoints
- **models** - Mongoose interaction with database
- **routes.ts** - App routes
- **server.ts** - Server start script

src/setup/
- scripts to download lds.org data and add to database
 
temp/ (default location)
- **data** - add your images and json downloaded from lds.org

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
2. `npm run watch`
3. `npm start`

#### Useful Commands
* `npm start` Starts the server
* `npm run build` Builds
* `npm run watch` Builds continuously, watching files

Note: `npm run` may be substituted for `gulp` if you have it installed globally.

### Todos

#### Application

- all people on a page
- login security and https
- deploy on Heroku

#### Environment




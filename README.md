# namelearner

Learn the names of those in your organization. Written by Joseph White, 2016-2017. Unauthorized use prohibited.

### Todos

#### Application

The application now can upload images via a separate page. Submit JSON via the "Add" tab. Next:

Note: credentials: root/5091 or admin/Crisis6062

- Make my user have more privileges so I can do this from home
- Hashed passwords, remove from Git repo, change pwd. http://scottksmith.com/blog/2014/05/29/beer-locker-building-a-restful-api-with-node-passport/
- Add multiple users from JSON expects object not array (Error in resource configuration for action `save`.
  Expected response to contain an object but got an array (Request: POST /api/people))
- Add "Welcome Joseph" to Angular app by using 'req.user' (or maybe not, since only Express can access it?)
- password hash
- upload images via same server
- deploy on Digital Ocean or AWS
- users

#### Environment

- get scss source maps to load


### Usage

#### Import My Ward

1. Setup development environment (below)

2. Download ward directory 
- Navigate to your ward's directory on lds.org.
- Inject dist/setup/downloadInfo.js into Chrome developer console
- Wait for photos and data.json to download

3. Import ward directory
- run dist/server/upload.js on server and follow its directions to upload photos
- use Angular app at localhost:8020 to upload all data.

#### Setup Development Environment

Run the following commands
1. `npm install` - install all dependencies
2. `npm run watch` - gulp watch for changes in TS code
3. `npm start` - start your server

Note: `gulp build` and `gulp` may be substituted for 
`npm run build` and `npm run watch` if you have gulp installed globally.

- forever start ./forever.json
- forever stop

#### Useful commands
- `npm run build` - gulp builds project only once

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


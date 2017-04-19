#!/bin/bash

# Add output to same log that Forever.js uses
node ./node_modules/forever/bin/forever stopall

echo "   ***git pull"
git pull &>> ~/.forever/forever.log

echo "   ***npm i"
npm i &>> ~/.forever/forever.log

echo "   ***gulp build"
node ./node_modules/gulp/bin/gulp.js build &>> ~/.forever/forever.log

node ./node_modules/forever/bin/forever start forever.json



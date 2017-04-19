#!/bin/bash

# Add output to same log that Forever.js uses
node ./node_modules/forever/bin/forever stopall

echo "   ***git pull" &>> ~/.forever/forever.log
git pull &>> ~/.forever/forever.log

echo "   ***npm i" &>> ~/.forever/forever.log
npm i &>> ~/.forever/forever.log

echo "   ***gulp build" &>> ~/.forever/forever.log
node ./node_modules/gulp/bin/gulp.js build &>> ~/.forever/forever.log

node ./node_modules/forever/bin/forever start forever.json



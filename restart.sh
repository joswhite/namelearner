#!/bin/bash

# Add output to same log that Forever.js uses
node ./node_modules/forever/bin/forever stopall
git pull &>> ~/.forever/forever.log
npm i &>> ~/.forever/forever.log
gulp build &>> ~/.forever/forever.log
node ./node_modules/forever/bin/forever start forever.json



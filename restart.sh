#!/bin/bash

#node ./node_modules/forever/bin/forever stopall
#git pull
##npm i
#gulp build
#node ./node_modules/forever/bin/forever start forever.json

echo "Its a long time" &>> ~/.forever/forever.log
sleep 1
echo "Its done" &>> ~/.forever/forever.log



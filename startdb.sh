#!/bin/bash
# run this before anything else
chmod +x startdb.sh

# to start all apps
# ./startdb.sh

docker-compose up -d --build --force-recreate
sleep 30
docker exec mongo1 /scripts/rs-init.sh


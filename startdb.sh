#!/bin/bash
# run this before anything else
chmod +x startdb.sh

# to start all apps
# ./startdb.sh

# docker-compose up -d --build mongo1 mongo2 mongo3
# sleep 10
docker exec mongo1 /scripts/rs-init.sh
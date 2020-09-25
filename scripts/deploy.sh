#!/bin/bash

set -a
. ./.env
set +a

# Generate ormconfig.json
npm run generate:ormconfig

# Build distribution (dist) directory 
npm run prebuild
npm run build

# Deploy with Serverless if applicable
if [ $DEPLOY_WITH_SERVERLESS ]
echo "Deploy with Serverless: " $DEPLOY_WITH_SERVERLESS
then
    serverless deploy --force -v
fi

# Run migrations
# npm run migrations
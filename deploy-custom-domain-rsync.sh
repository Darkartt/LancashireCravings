#!/bin/bash

# Deploy using rsync (faster and more reliable)
# Usage: ./deploy-custom-domain-rsync.sh [user@host:path]

REMOTE_PATH=${1:-"user@exampledesigns.co.uk:/var/www/html"}

echo "Building website..."
npm run build

echo "Deploying to $REMOTE_PATH..."

rsync -avz --delete out/ $REMOTE_PATH/

echo "Deployment complete!"
echo "Visit: https://exampledesigns.co.uk"

#!/bin/bash

# Deploy to custom domain script
# Usage: ./deploy-custom-domain.sh [ftp_user] [ftp_host]

FTP_USER=${1:-"your_ftp_username"}
FTP_HOST=${2:-"exampledesigns.co.uk"}
FTP_PATH=${3:-"/public_html"}

echo "Building website..."
npm run build

echo "Uploading files to $FTP_HOST..."

# Use lftp for better FTP support
lftp -c "
open -u $FTP_USER, ftp://$FTP_HOST
mirror -R --delete --verbose out/ $FTP_PATH/
bye
"

echo "Deployment complete!"
echo "Visit: https://$FTP_HOST"

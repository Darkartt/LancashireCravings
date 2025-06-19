#!/bin/bash

# Script to test the static export locally
echo "Building and testing the static export locally..."

# Build the project
npm run build

if [ $? -ne 0 ]; then
  echo "Build failed! Please check the errors above."
  exit 1
fi

echo "Build successful! Starting a local server to test the static export..."

# Create .nojekyll file in the out directory
touch out/.nojekyll

# Copy CNAME file to the out directory if it exists
if [ -f CNAME ]; then
  cp CNAME out/
  echo "Copied CNAME file to out directory."
fi

# Serve the static files using a simple HTTP server
# Using npx serve which is commonly available
npx serve out

echo "Server stopped. If everything looked good, you can deploy to GitHub Pages."

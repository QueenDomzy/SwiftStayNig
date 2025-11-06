#!/bin/sh
echo "Installing dependencies..."
npm install

echo "Building backend..."
npm run build

echo "Starting server..."
npm start

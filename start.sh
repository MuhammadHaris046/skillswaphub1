#!/bin/bash

echo "Starting SkillSwap Hub..."

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "MongoDB is not running. Please start MongoDB first."
    echo "You can start it with: sudo systemctl start mongod"
    echo "Or use: mongod (if installed locally)"
    exit 1
fi

# Navigate to backend directory
cd backend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    yarn install
fi

# Start the server
echo "Starting server on port 5000..."
yarn start

#!/bin/bash
echo "Starting Mi Open WebUI..."

cd server
gnome-terminal -- bash -c "npm install && npm run dev; exec bash" &
cd ../client
gnome-terminal -- bash -c "npm install && npm run dev; exec bash" &

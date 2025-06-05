@echo off
echo Starting Mi Open WebUI...

cd server
start cmd /k "npm install && npm run dev"
cd ../client
start cmd /k "npm install && npm run dev"

echo Done.

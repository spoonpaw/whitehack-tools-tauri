@echo off
echo Demarrage du serveur frontend...
cd frontend
start /b npm run dev
timeout /t 3 /nobreak > nul
echo Demarrage de l'application Tauri...
cd ../backend
cargo tauri dev --no-dev-server-wait
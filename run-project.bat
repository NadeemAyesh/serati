@echo off
chcp 65001 >nul
title Seerati AI - تشغيل منصة سيرتي
echo ============================================================
echo   🚀 تشغيل منصة سيرتي (MEAN Stack + AI)
echo ============================================================
echo.
echo [1/2] جاري تشغيل سيرفر الباك إند (Express + MongoDB) على المنفذ 5000...
start "Seerati Backend (Port 5000)" cmd /k "cd server && npm start"

timeout /t 3 /nobreak >nul

echo [2/2] جاري تشغيل واجهة المستخدم (Angular 22) على المنفذ 4200...
start "Seerati Frontend (Port 4200)" cmd /k "cd client && npm start"

echo.
echo ============================================================
echo   ✨ تم تشغيل السيرفرات بنجاح!
echo   🔗 افتح المتصفح على: http://localhost:4200
echo ============================================================
pause

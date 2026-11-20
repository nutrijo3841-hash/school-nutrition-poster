@echo off
chcp 65001 > nul
title 영양쏙쏙 - 영양교사 식재료 교육 포스터 생성기
echo ========================================================
echo   [영양쏙쏙] 전국 영양교사용 포스터 웹앱을 실행합니다.
echo ========================================================
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause

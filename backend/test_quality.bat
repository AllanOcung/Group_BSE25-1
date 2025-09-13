@echo off
echo =====================================
echo    Testing Backend Code Quality
echo =====================================

echo [1/3] Testing Black formatting...
black . --check
if %errorlevel% neq 0 (
    echo Auto-formatting code...
    black .
)

echo [2/3] Testing Flake8 linting...
flake8 . --count

echo [3/3] Testing overall quality...
call scripts\lint.bat

echo ✅ Code quality tools working!
pause
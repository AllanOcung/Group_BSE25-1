@echo off
echo =====================================
echo    Backend Testing Suite
echo =====================================

echo [1/3] Running Django system checks...
python manage.py check
if %errorlevel% neq 0 (
    echo Django system check failed
    exit /b 1
)

echo.
echo [2/3] Running Django tests...
python manage.py test --verbosity=2
if %errorlevel% neq 0 (
    echo  Django tests failed
    exit /b 1
)

echo.
echo [3/3] Running pytest with coverage...
pytest --cov=. --cov-report=html --cov-report=term
if %errorlevel% neq 0 (
    echo  Pytest failed
    exit /b 1
)

echo.
echo =====================================
echo     All tests passed!
echo =====================================
echo Coverage report: htmlcov/index.html
pause
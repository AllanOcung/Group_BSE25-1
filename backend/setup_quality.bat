@echo off
echo =====================================
echo    Backend Code Quality Setup
echo =====================================

echo [1/4] Installing quality tools...
pip install black flake8 isort mypy django-stubs bandit pre-commit pytest pytest-django pytest-cov

echo [2/4] Setting up pre-commit hooks...
pre-commit install

echo [3/4] Running initial format...
black .
isort .

echo [4/4] Running quality checks...
flake8 .
echo ✅ Backend code quality tools ready!

echo.
echo Available commands:
echo - scripts\format.bat    : Format code
echo - scripts\lint.bat      : Check code quality  
echo - scripts\test.bat      : Run tests
echo.
pause
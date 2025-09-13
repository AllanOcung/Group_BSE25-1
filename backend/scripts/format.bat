@echo off
echo =====================================
echo    Backend Code Formatting
echo =====================================

echo [1/3] Running Black (code formatter)...
black . --check --diff
if %errorlevel% neq 0 (
    echo Formatting issues found. Auto-fixing...
    black .
    echo ✅ Code formatted with Black
) else (
    echo ✅ Code already properly formatted
)

echo.
echo [2/3] Running isort (import sorting)...
isort . --check-only --diff
if %errorlevel% neq 0 (
    echo Import sorting issues found. Auto-fixing...
    isort .
    echo ✅ Imports sorted with isort
) else (
    echo ✅ Imports already properly sorted
)

echo.
echo [3/3] Running Flake8 (linting)...
flake8 .
if %errorlevel% neq 0 (
    echo ❌ Linting issues found!
    echo Please fix the issues above
    exit /b 1
) else (
    echo ✅ All linting checks passed
)

echo.
echo =====================================
echo    Code formatting complete!
echo =====================================
pause
@echo off
echo =====================================
echo    Backend Code Quality Check
echo =====================================

echo [1/5] Running Flake8 (style check)...
flake8 . --statistics --count
if %errorlevel% neq 0 (
    echo  Flake8 found style issues
    set ERRORS=1
) else (
    echo  Flake8 passed
)

echo.
echo [2/5] Running Black (format check)...
black . --check
if %errorlevel% neq 0 (
    echo  Black found formatting issues
    echo Run 'black .' to fix them
    set ERRORS=1
) else (
    echo  Black formatting check passed
)

echo.
echo [3/5] Running isort (import check)...
isort . --check-only
if %errorlevel% neq 0 (
    echo  isort found import sorting issues
    echo Run 'isort .' to fix them
    set ERRORS=1
) else (
    echo  isort import check passed
)

echo.
echo [4/5] Running MyPy (type check)...
mypy . --ignore-missing-imports
if %errorlevel% neq 0 (
    echo  MyPy found type issues (warnings)
) else (
    echo  MyPy type check passed
)

echo.
echo [5/5] Running Bandit (security check)...
bandit -r . -f json -o bandit-report.json
if %errorlevel% neq 0 (
    echo ⚠️ Bandit found potential security issues
    echo Check bandit-report.json for details
) else (
    echo Bandit security check passed
)

echo.
if defined ERRORS (
    echo =====================================
    echo    Code quality issues found!
    echo =====================================
    echo Please fix the issues above before committing
    exit /b 1
) else (
    echo =====================================
    echo    All code quality checks passed!
    echo =====================================
)
pause
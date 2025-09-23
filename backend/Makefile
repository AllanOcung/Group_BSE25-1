# Backend Code Quality Commands

.PHONY: format lint test install clean

# Install dependencies
install:
    pip install -r requirements.txt
    pre-commit install

# Format code
format:
    black .
    isort .

# Check code quality
lint:
    flake8 .
    black . --check
    isort . --check-only
    mypy . --ignore-missing-imports
    bandit -r . -f json -o bandit-report.json

# Run tests
test:
    python manage.py check
    python manage.py test
    pytest --cov=. --cov-report=html

# Clean up
clean:
    find . -type f -name "*.pyc" -delete
    find . -type d -name "__pycache__" -delete
    rm -rf .pytest_cache
    rm -rf .mypy_cache
    rm -rf htmlcov
    rm -f bandit-report.json

# Run everything
all: format lint test

# Development workflow
dev-setup: install
    python manage.py migrate
    python manage.py collectstatic --noinput


pre-commit:
    pre-commit run --all-files
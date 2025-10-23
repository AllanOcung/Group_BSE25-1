<!-- .github/copilot-instructions.md - Project-specific guidance for AI coding agents -->

# Quick orientation

This repository is a two-tier web app: a Django REST backend (backend/) and a Vite + React + TypeScript frontend (frontend/).

- Backend: Django 5 + Django REST Framework. Key entry points: `backend/manage.py`, `backend/project/settings.py`, apps `backend/users/` and `backend/blog/`.
- Frontend: Vite + React + TypeScript. Key files: `frontend/package.json`, `frontend/src/services/api.ts`, `frontend/src/pages` and `frontend/src/components`.

Work happens locally using the Python virtualenv in `backend/env` and Node in `frontend`.

# What the AI agent should know (high value, actionable)

1. API surface and auth

   - REST endpoints live under `backend/blog` (ViewSets) and `backend/users` (custom auth and profile logic). See `blog/views.py` for routes like `/api/projects/`, `/api/posts/`, plus custom actions `my_projects`, `featured`, `technologies`, `toggle_publish`.
   - Authentication uses JWT via `rest_framework_simplejwt`. Settings and token lifecycle are in `backend/project/settings.py` (SIMPLE_JWT). Use Authorization: `Bearer <token>` for protected endpoints.

2. Data shape and serializers

   - Serializers define the public contract. See `backend/blog/serializers.py` and `backend/users/serializers.py` — e.g. ProjectSerializer returns `tech_stack` (comma string) and `tech_stack_list` (computed list). Frontend `api.ts` expects form-data for create/update where files may be included.

3. Patterns and conventions

   - App-level viewsets use `get_permissions()` to select permission classes per action (create/update/destroy vs list). Follow the existing pattern when adding new viewsets.
   - Many model attributes are stored as comma-separated strings (tags, tech_stack, skills). Serializers expose helper fields (`*_list`) — keep this convention when adding fields or parsing client input.
   - `APPEND_SLASH=False` is used; API routes in tests call exact paths without trailing slashes. Mimic URLs exactly.
   - File uploads are handled as multipart/form-data. Frontend `ApiService` uses FormData for create/update.

4. Local dev, build and test commands (explicit)

   - Backend (Windows PowerShell):
     - Activate venv: `.ackend\\env\Scripts\Activate.ps1`
     - Install dependencies (if needed): `pip install -r backend\requirements.txt`
     - Run migrations: `python backend\manage.py migrate`
     - Run dev server: `python backend\manage.py runserver`
     - Run tests: from `backend/` run `pytest` (pytest settings in `backend/pytest.ini` use `DJANGO_SETTINGS_MODULE=project.settings`).
   - Frontend (PowerShell):
     - Install: `cd frontend; npm install`
     - Dev server: `npm run dev`
     - Build: `npm run build`
     - Tests: `npm run test` or `npm run test:ci` for CI.

5. CI / quality hints

   - Python tooling: black/isort/mypy configured in `backend/pyproject.toml`. Tests reuse DB via `--reuse-db` in pytest config.
   - Frontend uses ESLint, Prettier, Vitest (see `frontend/package.json` scripts).

6. Important files to inspect when changing behavior
   - `backend/project/settings.py` — env-driven config, CORS origins, JWT, DB config (dj_database_url fallback to sqlite).
   - `backend/blog/views.py` & `backend/blog/serializers.py` — show authorization flow and field mapping for posts/projects.
   - `backend/users/serializers.py` — registration, password reset, and profile representation (skills, role defaults).
   - `frontend/src/services/api.ts` — shows how front-end calls the backend (FormData, endpoints, base URL `http://localhost:8000/api`). Keep the API contract compatible.

# Safe-edit rules for the agent

- Preserve existing API shapes in serializers unless you also update `frontend/src/services/api.ts` and related components. Prefer additive changes (new fields with defaults) over breaking renames.
- When editing view permissions, follow the `get_permissions()` pattern used in `blog/views.py` (map actions to permission classes). Add tests in `backend/blog/tests/` mirroring existing patterns.
- Tests: update or add pytest tests under `backend/blog/tests/` and `backend/users/tests.py`. Use `APITestCase` + `RefreshToken.for_user(...)` helper as in current tests.
- Use `APPEND_SLASH=False` and explicit route names when constructing URLs in tests (`reverse('blog:project-list')`).

# Small examples (copyable patterns)

- Create a FormData-based request (frontend pattern): see `frontend/src/services/api.ts` createProject/createPost — always append file values only when defined.
- Serializer pattern to expose list and ensure owner/author assignment: see `ProjectSerializer.create()` and `PostSerializer.create()` — set `validated_data['owner']` or `['author']` using `self.context['request'].user`.

# If you need more context

- Read tests at `backend/blog/tests.py` to see expected API behavior and edge cases (roles: ADMIN, MEMBER, VIEWER).
- Check `backend/README` or root `README.md` for environment/setup notes.

Please review these instructions and tell me any gaps (missing integration details, CI specifics, or developer workflows) you want me to add or clarify.

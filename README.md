# Group Portfolio Platform

## Overview

The Group Portfolio Platform is a multi-user web application for showcasing projects, publishing blog posts, and managing member profiles. It provides role-based access for group members and administrators, while allowing public visitors to browse content without authentication.

---

## Software Requirements

### 1. Introduction

#### 1.1 Purpose
- Enable registered users to present projects and publish blogs.
- Admins can manage users and moderate content.
- Public visitors can browse projects, blogs, and member profiles.

#### 1.2 Scope
- User management with authentication and roles.
- Member profiles (skills, bios, links).
- Project showcase (details, tech stack, images).
- Blog publishing (tutorials, insights, updates).
- Admin dashboard for moderation/statistics.
- Public pages for browsing.
- Responsive design (mobile/desktop).
- Security for authentication and file handling.

#### 1.3 Users and Roles
- **Registered User:** Manage own profile, projects, blogs.
- **Admin:** Manage users, moderate content, view stats.
- **Public Visitor:** Browse public content only.

---

### 2. Functional Requirements

#### 2.1 User Management
- Register, login (JWT), password recovery/reset.
- Secure password storage.
- Role-based access (Admin/User).

#### 2.2 User Profiles
- Create/update personal profile.
- View other members’ profiles.

#### 2.3 Project Management
- Create/edit/delete own projects.
- Projects include title, description, tech stack, screenshots, links.
- Projects shown on profile and public showcase.

#### 2.4 Blog Management
- Write/edit/publish/delete own blog posts.
- Blog posts include title, content, cover image, tags.
- Public access to blog listing and posts.

#### 2.5 Admin Dashboard
- Manage users (add/edit/deactivate).
- Moderate/remove projects/blogs.
- View statistics.

#### 2.6 Public Pages
- Homepage highlights.
- Browse members/projects/blogs.

#### 2.7 File & Media Management
- Upload profile photos, project images, blog covers.
- Secure file storage and linking.

#### 2.8 Search & Navigation
- Search for members, projects, blogs.
- Filter/sort by category, tag, skill.

---

### 3. Non-Functional Requirements

#### 3.1 Performance
- Support 100+ concurrent users.
- Page load < 3 seconds.

#### 3.2 Security
- JWT authentication.
- Encrypt sensitive data (storage & transit).
- Input validation (SQLi, XSS, CSRF).
- File upload validation.

#### 3.3 Usability
- Responsive design.
- Intuitive navigation, consistent UI.

#### 3.4 Reliability & Availability
- 99% uptime.
- Recovery from last stable state.

#### 3.5 Maintainability
- Consistent code style (PEP8, ESLint).
- CI/CD for testing/deployment.

#### 3.6 Scalability
- Horizontal/vertical scaling.
- Database supports future features.

---

### 4. Constraints

- Use Git & GitHub for version control.
- Use ClickUp for task management.
- Backend: Django REST Framework + SQLite (dev).
- Frontend: React + CSS/Tailwind.
- 5-week assignment timeline.

---

### 5. Acceptance Criteria

- User registration, login, profile management.
- Projects visible on profile and public page.
- Blogs visible in public blog section.
- Admin can deactivate users/remove content.
- Public visitors can browse without login.
- All tasks tracked in ClickUp, weekly reports.

---

## Tech Stack

- **Backend:** Django REST Framework, SQLite (development)
- **Frontend:** React, TypeScript, Tailwind CSS, shadcn-ui
- **Dev Tools:** Vite, ESLint, CI/CD pipelines

---

## Getting Started

1. **Clone the repository**
   ```sh
   git clone https://github.com/AllanOcung/Group_BSE25-1.git

   cd Group_BSE25-1
   ```

2. **Backend Setup**
   ```sh
   cd backend
   python -m venv env
   source env/bin/activate  # or .\env\Scripts\activate on Windows
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

3. **Frontend Setup**
   ```sh
   cd frontend
   npm install
   npm run dev
   ```

---

## Project Structure

```
backend/
  manage.py
  requirements.txt
  env/
  project/
    settings.py
    urls.py
    ...
frontend/
  package.json
  src/
    components/
    pages/
    ...
```

---

## License

This project is for educational purposes.
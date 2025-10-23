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


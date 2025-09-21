from rest_framework.routers import DefaultRouter

from django.urls import include, path

from . import views

# Create router and register viewsets
router = DefaultRouter()
router.register(r"projects", views.ProjectViewSet, basename="project")
router.register(r"posts", views.PostViewSet, basename="post")

app_name = "blog"

urlpatterns = [
    # ViewSet routes (automatically generates CRUD endpoints)
    path("", include(router.urls)),
    # Additional custom API endpoints
    path("search/", views.search_content, name="search-content"),
    path("stats/", views.dashboard_stats, name="dashboard-stats"),
]

# This will generate the following routes:
#
# PROJECT ROUTES:
# GET    /api/blog/projects/              - List all projects
# POST   /api/blog/projects/              - Create new project
# GET    /api/blog/projects/{id}/         - Get specific project
# PUT    /api/blog/projects/{id}/         - Update specific project
# PATCH  /api/blog/projects/{id}/         - Partial update project
# DELETE /api/blog/projects/{id}/         - Delete specific project
# GET    /api/blog/projects/my_projects/  - Get current user's projects
# GET    /api/blog/projects/featured/     - Get featured projects
# GET    /api/blog/projects/technologies/ - Get all technologies
#
# BLOG POST ROUTES:
# GET    /api/blog/posts/                 - List all published posts
# POST   /api/blog/posts/                 - Create new post
# GET    /api/blog/posts/{id}/            - Get specific post
# PUT    /api/blog/posts/{id}/            - Update specific post
# PATCH  /api/blog/posts/{id}/            - Partial update post
# DELETE /api/blog/posts/{id}/            - Delete specific post
# GET    /api/blog/posts/my_posts/        - Get current user's posts
# GET    /api/blog/posts/featured/        - Get featured posts
# GET    /api/blog/posts/tags/            - Get all tags
# POST   /api/blog/posts/{id}/toggle_publish/ - Toggle post publication
#
# ADDITIONAL ROUTES:
# GET    /api/blog/search/?q=query        - Global search
# GET    /api/blog/stats/                 - Dashboard statistics

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
    # Public API endpoints
    path("search/", views.search_content, name="search-content"),
    path("stats/", views.dashboard_stats, name="dashboard-stats"),
    # Admin-only API endpoints
    path("admin/stats/", views.admin_stats, name="admin-stats"),
]
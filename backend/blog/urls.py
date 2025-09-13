from django.urls import path

from . import views

urlpatterns = [
    # Project endpoints
    path(
        "projects/", views.ProjectListCreateView.as_view(), name="project-list-create"
    ),
    path(
        "projects/<int:pk>/", views.ProjectDetailView.as_view(), name="project-detail"
    ),
    # Blog post endpoints
    path("posts/", views.PostListCreateView.as_view(), name="post-list-create"),
    path("posts/<int:pk>/", views.PostDetailView.as_view(), name="post-detail"),
]

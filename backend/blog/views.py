from django.contrib.auth.models import User
from django.shortcuts import render

from rest_framework import generics, permissions, status  # type: ignore
from rest_framework.response import Response  # type: ignore

from .models import Post, Project  # Import your models from the same app
from .serializers import PostSerializer, ProjectSerializer


# =======================
# PROJECT VIEWS
# =======================
class ProjectListCreateView(generics.ListCreateAPIView):
    queryset = Project.objects.all().order_by("-created_at")
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        # Temporarily use Django's built-in User model
        # Later we'll switch to your custom User model when accounts app is ready
        serializer.save(owner=self.request.user)


class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_permissions(self):
        # Only allow owners to edit/delete their projects
        if self.request.method in ["PUT", "PATCH", "DELETE"]:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]


# =======================
# BLOG POST VIEWS
# =======================
class PostListCreateView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        # Show all posts to authenticated users, only published to anonymous users
        if self.request.user.is_authenticated:
            return Post.objects.all().order_by("-created_at")
        return Post.objects.filter(is_published=True).order_by("-created_at")

    def perform_create(self, serializer):
        # Temporarily use Django's built-in User model
        serializer.save(author=self.request.user)


class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_permissions(self):
        # Only allow authors to edit/delete their posts
        if self.request.method in ["PUT", "PATCH", "DELETE"]:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

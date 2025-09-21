from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from django.db.models import Q

from .models import Post, Project
from .serializers import (
    PostListSerializer,
    PostSerializer,
    ProjectListSerializer,
    ProjectSerializer,
)


class ProjectViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing projects with full CRUD operations
    """

    queryset = Project.objects.select_related("owner").all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["owner"]
    search_fields = ["title", "description", "tech_stack"]
    ordering_fields = ["created_at", "updated_at", "title"]
    ordering = ["-created_at"]

    def get_serializer_class(self):
        """
        Use different serializers for list vs detail views
        """
        if self.action == "list":
            return ProjectListSerializer
        return ProjectSerializer

    def get_queryset(self):
        """
        Filter projects based on query parameters
        """
        queryset = Project.objects.select_related("owner").all()

        # Filter by technology
        tech = self.request.query_params.get("tech", None)
        if tech:
            queryset = queryset.filter(tech_stack__icontains=tech)

        # Filter by owner (for user's own projects)
        if self.action == "my_projects":
            queryset = queryset.filter(owner=self.request.user)

        return queryset

    def perform_create(self, serializer):
        """
        Set the owner to the current user when creating a project
        """
        serializer.save(owner=self.request.user)

    def perform_update(self, serializer):
        """
        Only allow owners to update their own projects
        """
        if serializer.instance.owner != self.request.user:
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied("You can only update your own projects.")
        serializer.save()

    def perform_destroy(self, instance):
        """
        Only allow owners to delete their own projects
        """
        if instance.owner != self.request.user:
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied("You can only delete your own projects.")
        instance.delete()

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def my_projects(self, request):
        """
        Get current user's projects
        """
        queryset = self.get_queryset().filter(owner=request.user)
        serializer = ProjectListSerializer(
            queryset, many=True, context={"request": request}
        )
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def featured(self, request):
        """
        Get featured projects (latest 6 projects)
        """
        queryset = self.get_queryset()[:6]
        serializer = ProjectListSerializer(
            queryset, many=True, context={"request": request}
        )
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def technologies(self, request):
        """
        Get all unique technologies used in projects
        """
        projects = Project.objects.exclude(tech_stack="").values_list(
            "tech_stack", flat=True
        )
        technologies = set()

        for tech_stack in projects:
            if tech_stack:
                techs = [tech.strip() for tech in tech_stack.split(",")]
                technologies.update(techs)

        return Response(sorted(list(technologies)))


class PostViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing blog posts with full CRUD operations
    """

    queryset = Post.objects.select_related("author").filter(is_published=True)
    permission_classes = [IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["author", "is_published"]
    search_fields = ["title", "content", "tags"]
    ordering_fields = ["created_at", "updated_at", "title"]
    ordering = ["-created_at"]

    def get_serializer_class(self):
        """
        Use different serializers for list vs detail views
        """
        if self.action == "list":
            return PostListSerializer
        return PostSerializer

    def get_queryset(self):
        """
        Filter posts based on query parameters and permissions
        """
        queryset = Post.objects.select_related("author")

        # Show all posts to authenticated users in certain actions
        if self.action in ["my_posts", "create", "update", "partial_update", "destroy"]:
            # Don't filter by is_published for these actions
            pass
        else:
            # Only show published posts for public viewing
            queryset = queryset.filter(is_published=True)

        # Filter by tag
        tag = self.request.query_params.get("tag", None)
        if tag:
            queryset = queryset.filter(tags__icontains=tag)

        return queryset

    def perform_create(self, serializer):
        """
        Set the author to the current user when creating a post
        """
        serializer.save(author=self.request.user)

    def perform_update(self, serializer):
        """
        Only allow authors to update their own posts
        """
        if serializer.instance.author != self.request.user:
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied("You can only update your own posts.")
        serializer.save()

    def perform_destroy(self, instance):
        """
        Only allow authors to delete their own posts
        """
        if instance.author != self.request.user:
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied("You can only delete your own posts.")
        instance.delete()

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def my_posts(self, request):
        """
        Get current user's posts (including unpublished)
        """
        queryset = Post.objects.filter(author=request.user).order_by("-created_at")
        serializer = PostListSerializer(
            queryset, many=True, context={"request": request}
        )
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def featured(self, request):
        """
        Get featured posts (latest 6 published posts)
        """
        queryset = self.get_queryset()[:6]
        serializer = PostListSerializer(
            queryset, many=True, context={"request": request}
        )
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def tags(self, request):
        """
        Get all unique tags used in published posts
        """
        posts = (
            Post.objects.filter(is_published=True)
            .exclude(tags="")
            .values_list("tags", flat=True)
        )
        tags = set()

        for tag_string in posts:
            if tag_string:
                post_tags = [tag.strip() for tag in tag_string.split(",")]
                tags.update(post_tags)

        return Response(sorted(list(tags)))

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def toggle_publish(self, request, pk=None):
        """
        Toggle the published status of a post (author only)
        """
        post = self.get_object()

        if post.author != request.user:
            return Response(
                {"error": "You can only modify your own posts."},
                status=status.HTTP_403_FORBIDDEN,
            )

        post.is_published = not post.is_published
        post.save()

        serializer = PostSerializer(post, context={"request": request})
        return Response(serializer.data)


# Additional API views for specific functionality
@api_view(["GET"])
@permission_classes([])
def search_content(request):
    """
    Global search across projects and posts
    """
    query = request.GET.get("q", "")

    if not query:
        return Response(
            {"projects": [], "posts": [], "message": "No search query provided"}
        )

    # Search projects
    projects = Project.objects.filter(
        Q(title__icontains=query)
        | Q(description__icontains=query)
        | Q(tech_stack__icontains=query)
    ).select_related("owner")[:5]

    # Search published posts
    posts = Post.objects.filter(
        Q(title__icontains=query)
        | Q(content__icontains=query)
        | Q(tags__icontains=query),
        is_published=True,
    ).select_related("author")[:5]

    return Response(
        {
            "projects": ProjectListSerializer(
                projects, many=True, context={"request": request}
            ).data,
            "posts": PostListSerializer(
                posts, many=True, context={"request": request}
            ).data,
            "query": query,
        }
    )


@api_view(["GET"])
@permission_classes([])
def dashboard_stats(request):
    """
    Get dashboard statistics (public stats)
    """
    from django.contrib.auth import get_user_model

    User = get_user_model()

    stats = {
        "total_users": User.objects.count(),
        "total_projects": Project.objects.count(),
        "total_posts": Post.objects.filter(is_published=True).count(),
        "recent_projects": Project.objects.count(),
        "recent_posts": Post.objects.filter(is_published=True).count(),
    }

    return Response(stats)

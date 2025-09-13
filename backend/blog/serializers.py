from rest_framework import serializers  # type: ignore

from .models import Post, Project


class ProjectSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source="owner.username", read_only=True)

    class Meta:
        model = Project
        fields = [
            "id",
            "owner",
            "owner_username",
            "title",
            "description",
            "tech_stack",
            "demo_link",
            "source_code",
            "image",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "owner_username"]


class PostSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source="author.username", read_only=True)

    class Meta:
        model = Post
        fields = [
            "id",
            "author",
            "author_username",
            "title",
            "content",
            "cover_image",
            "tags",
            "is_published",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "author_username"]

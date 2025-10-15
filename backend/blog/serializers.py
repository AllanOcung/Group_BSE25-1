from rest_framework import serializers

from users.serializers import UserProfileSerializer

from .models import Post, Project


class ProjectSerializer(serializers.ModelSerializer):
    """
    Serializer for Project model with owner details
    """

    owner = UserProfileSerializer(read_only=True)
    tech_stack_list = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "description",
            "tech_stack",
            "tech_stack_list",
            "demo_link",
            "source_code",
            "image",
            "owner",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "owner", "created_at", "updated_at"]

    def get_tech_stack_list(self, obj):
        """
        Convert comma-separated tech_stack string to list
        """
        if obj.tech_stack:
            return [tech.strip() for tech in obj.tech_stack.split(",") if tech.strip()]
        return []

    def create(self, validated_data):
        """
        Set the owner to the current user when creating
        """
        validated_data["owner"] = self.context["request"].user
        return super().create(validated_data)


class ProjectListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for project listings
    """

    owner_name = serializers.CharField(source="owner.get_full_name", read_only=True)
    tech_stack_list = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "description",
            "tech_stack_list",
            "demo_link",
            "image",
            "owner_name",
            "created_at",
        ]

    def get_tech_stack_list(self, obj):
        """
        Convert comma-separated tech_stack string to list
        """
        if obj.tech_stack:
            return [tech.strip() for tech in obj.tech_stack.split(",") if tech.strip()]
        return []


class PostSerializer(serializers.ModelSerializer):
    """
    Serializer for Blog Post model with author details
    """

    author = UserProfileSerializer(read_only=True)
    tags_list = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "content",
            "cover_image",
            "tags",
            "tags_list",
            "is_published",
            "author",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "author", "created_at", "updated_at"]

    def get_tags_list(self, obj):
        """
        Convert comma-separated tags string to list
        """
        if obj.tags:
            return [tag.strip() for tag in obj.tags.split(",") if tag.strip()]
        return []

    def create(self, validated_data):
        """
        Set the author to the current user when creating
        """
        validated_data["author"] = self.context["request"].user
        return super().create(validated_data)


class PostListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for blog post listings
    """

    author_name = serializers.CharField(source="author.get_full_name", read_only=True)
    tags_list = serializers.SerializerMethodField()
    excerpt = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "excerpt",
            "cover_image",
            "tags_list",
            "is_published",
            "author_name",
            "created_at",
        ]

    def get_tags_list(self, obj):
        """
        Convert comma-separated tags string to list
        """
        if obj.tags:
            return [tag.strip() for tag in obj.tags.split(",") if tag.strip()]
        return []

    def get_excerpt(self, obj):
        """
        Return first 200 characters of content as excerpt
        """
        if obj.content:
            return obj.content[:200] + ("..." if len(obj.content) > 200 else "")

        return ""

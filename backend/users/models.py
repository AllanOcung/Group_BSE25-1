from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Enhanced User model with role-based access control
    """

    # Role choices
    class Role(models.TextChoices):
        ADMIN = "admin", "Admin"
        MEMBER = "member", "Member"
        VIEWER = "viewer", "Viewer"

    # Basic profile fields
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    bio = models.TextField(blank=True, max_length=500)

    # Role field
    role = models.CharField(
        max_length=10,
        choices=Role.choices,
        default=Role.MEMBER,
        help_text="User role determines access permissions",
    )

    # Profile fields
    skills = models.CharField(
        max_length=500, blank=True, help_text="Comma-separated skills"
    )
    profile_photo = models.ImageField(
        upload_to="profile_photos/", blank=True, null=True
    )

    # Social links
    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    personal_website = models.URLField(blank=True)

    # Status fields
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(blank=True, null=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username", "first_name", "last_name"]

    class Meta:
        db_table = "users_user"
        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ["-date_joined"]

    def __str__(self):
        return f"{self.get_full_name()} ({self.email})"

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    @property
    def is_admin(self):
        """Check if user has admin role"""
        return self.role == self.Role.ADMIN or self.is_superuser

    @property
    def is_member(self):
        """Check if user has member role"""
        return self.role == self.Role.MEMBER

    @property
    def is_viewer(self):
        """Check if user has viewer role"""
        return self.role == self.Role.VIEWER

    @property
    def can_create_content(self):
        """Check if user can create projects and blog posts"""
        return self.is_admin or self.is_member

    @property
    def can_moderate_content(self):
        """Check if user can moderate content"""
        return self.is_admin or self.is_superuser

    def get_skills_list(self):
        """Convert comma-separated skills to list"""
        if self.skills:
            return [skill.strip() for skill in self.skills.split(",") if skill.strip()]
        return []

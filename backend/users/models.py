from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    USER_ROLES = (
        ("user", "Regular User"),
        ("admin", "Administrator"),
    )

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=USER_ROLES, default="user")
    bio = models.TextField(max_length=500, blank=True)
    skills = models.JSONField(default=list, blank=True)
    profile_photo = models.ImageField(
        upload_to="profile_photos/", null=True, blank=True
    )
    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    class Meta:
        db_table = "users"

    def __str__(self):
        return f"{self.username} ({self.email})"

    def is_admin(self):
        return self.role == "admin"

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

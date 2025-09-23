# using @admin.display decorator
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.db.models import QuerySet
from django.http import HttpRequest

from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """
    Custom admin interface for User model with role-based management
    """

    list_display = [
        "email",
        "username",
        "get_full_name",
        "role",
        "is_active",
        "date_joined",
        "last_login",
    ]

    list_filter = [
        "role",
        "is_active",
        "is_staff",
        "date_joined",
        "last_login",
    ]

    search_fields = ["email", "username", "first_name", "last_name"]
    ordering = ["-date_joined"]
    readonly_fields = ["date_joined", "last_login"]
    actions = ["activate_users", "deactivate_users", "make_members", "make_viewers"]

    # ... fieldsets remain the same ...

    @admin.display(description="Full Name")
    def get_full_name(self, obj: User) -> str:
        """Display user's full name"""
        return obj.get_full_name() or "-"

    @admin.action(description="Activate selected users")
    def activate_users(self, request: HttpRequest, queryset: QuerySet[User]) -> None:
        """Activate selected users"""
        updated = queryset.update(is_active=True)
        self.message_user(request, f"{updated} users were activated.")

    @admin.action(description="Deactivate selected users")
    def deactivate_users(self, request: HttpRequest, queryset: QuerySet[User]) -> None:
        """Deactivate selected users"""
        updated = queryset.update(is_active=False)
        self.message_user(request, f"{updated} users were deactivated.")

    @admin.action(description="Change to Member role")
    def make_members(self, request: HttpRequest, queryset: QuerySet[User]) -> None:
        """Change selected users to members"""
        updated = queryset.update(role=User.Role.MEMBER)
        self.message_user(request, f"{updated} users were changed to members.")

    @admin.action(description="Change to Viewer role")
    def make_viewers(self, request: HttpRequest, queryset: QuerySet[User]) -> None:
        """Change selected users to viewers"""
        updated = queryset.update(role=User.Role.VIEWER)
        self.message_user(request, f"{updated} users were changed to viewers.")

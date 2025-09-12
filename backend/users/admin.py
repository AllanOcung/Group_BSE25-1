from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User
from typing import Any, List, Tuple


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ("username", "email", "role", "is_active", "is_staff", "created_at")
    list_filter = ("role", "is_active", "is_staff", "created_at")
    search_fields = ("username", "email", "first_name", "last_name")
    ordering = ("-created_at",)

    # Safely construct fieldsets/add_fieldsets for typing (UserAdmin.fieldsets may be tuple or None)
    _base_fieldsets: List[Tuple[Any, Any]] = list(UserAdmin.fieldsets) if UserAdmin.fieldsets else []
    _extra_fieldsets: List[Tuple[str, dict]] = [
        ('Profile Info', {
            'fields': ('role', 'bio', 'skills', 'profile_photo', 'github_url', 'linkedin_url', 'portfolio_url')
        }),
    ]
    fieldsets = tuple(_base_fieldsets + _extra_fieldsets)

    _base_add_fieldsets: List[Tuple[Any, Any]] = list(UserAdmin.add_fieldsets) if UserAdmin.add_fieldsets else []
    _extra_add_fieldsets: List[Tuple[str, dict]] = [
        ('Profile Info', {
            'fields': ('email', 'role')
        }),
    ]
    add_fieldsets = tuple(_base_add_fieldsets + _extra_add_fieldsets)

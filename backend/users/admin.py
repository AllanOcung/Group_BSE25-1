from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html

from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """
    Custom admin interface for User model with role-based management
    """

    # Display fields in list view
    list_display = [
        "email",
        "username",
        "get_full_name",
        "role",
        "is_active",
        "date_joined",
        "last_login",
    ]

    # Filter options
    list_filter = [
        "role",
        "is_active",
        "is_staff",
        "date_joined",  # Changed from 'created_at'
        "last_login",
    ]

    # Search fields
    search_fields = ["email", "username", "first_name", "last_name"]

    # Ordering
    ordering = ["-date_joined"]  # Changed from 'created_at'

    # Fields to display in detail view
    fieldsets = (
        (None, {"fields": ("email", "username", "password")}),
        (
            "Personal Info",
            {"fields": ("first_name", "last_name", "bio", "profile_photo")},
        ),
        (
            "Skills & Social",
            {
                "fields": ("skills", "linkedin_url", "github_url", "personal_website"),
                "classes": ("collapse",),
            },
        ),
        (
            "Permissions",
            {
                "fields": (
                    "role",
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
                "classes": ("collapse",),
            },
        ),
        (
            "Important Dates",
            {"fields": ("last_login", "date_joined"), "classes": ("collapse",)},
        ),
    )

    # Fields for adding new users
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "username",
                    "first_name",
                    "last_name",
                    "password1",
                    "password2",
                    "role",
                ),
            },
        ),
    )

    # Read-only fields
    readonly_fields = ["date_joined", "last_login"]

    # Custom methods for display
    def get_full_name(self, obj):
        """Display user's full name"""
        return obj.get_full_name() or "-"

    get_full_name.short_description = "Full Name"

    # Actions
    actions = ["activate_users", "deactivate_users", "make_members", "make_viewers"]

    def activate_users(self, request, queryset):
        """Activate selected users"""
        updated = queryset.update(is_active=True)
        self.message_user(request, f"{updated} users were activated.")

    activate_users.short_description = "Activate selected users"

    def deactivate_users(self, request, queryset):
        """Deactivate selected users"""
        updated = queryset.update(is_active=False)
        self.message_user(request, f"{updated} users were deactivated.")

    deactivate_users.short_description = "Deactivate selected users"

    def make_members(self, request, queryset):
        """Change selected users to members"""
        updated = queryset.update(role=User.Role.MEMBER)
        self.message_user(request, f"{updated} users were changed to members.")

    make_members.short_description = "Change to Member role"

    def make_viewers(self, request, queryset):
        """Change selected users to viewers"""
        updated = queryset.update(role=User.Role.VIEWER)
        self.message_user(request, f"{updated} users were changed to viewers.")

    make_viewers.short_description = "Change to Viewer role"

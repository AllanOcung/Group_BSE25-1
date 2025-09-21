from rest_framework import permissions


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admins to edit.
    Read permissions are allowed for any authenticated user.
    """

    def has_permission(self, request, view):
        # Read permissions for authenticated users
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated

        # Write permissions only for admins
        return request.user and request.user.is_authenticated and request.user.is_admin


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object or admins to edit it.
    """

    def has_permission(self, request, view):
        # Must be authenticated
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Read permissions for any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions for owner or admin
        if hasattr(obj, "owner"):
            return obj.owner == request.user or request.user.is_admin
        elif hasattr(obj, "author"):
            return obj.author == request.user or request.user.is_admin
        elif hasattr(obj, "user"):
            return obj.user == request.user or request.user.is_admin

        # Fallback to admin only
        return request.user.is_admin


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    Read permissions are allowed for any authenticated user.
    """

    def has_permission(self, request, view):
        # Must be authenticated
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Read permissions for any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions only for the owner
        if hasattr(obj, "owner"):
            return obj.owner == request.user
        elif hasattr(obj, "author"):
            return obj.author == request.user
        elif hasattr(obj, "user"):
            return obj.user == request.user

        return False


class CanCreateContent(permissions.BasePermission):
    """
    Permission class for users who can create content (projects, blog posts)
    """

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False

        # Admins and members can create content
        return request.user.can_create_content


class CanModerateContent(permissions.BasePermission):
    """
    Permission class for users who can moderate content
    """

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False

        # Only admins can moderate
        return request.user.can_moderate_content


class IsAdminUser(permissions.BasePermission):
    """
    Allows access only to admin users.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_admin

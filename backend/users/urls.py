from rest_framework.routers import DefaultRouter

from django.urls import include, path

from . import views

# Create router for user management
router = DefaultRouter()
router.register(r"users", views.UserViewSet, basename="user")

app_name = "users"

urlpatterns = [
    # Authentication endpoints
    path("register/", views.UserRegistrationView.as_view(), name="register"),
    path("login/", views.UserLoginView.as_view(), name="login"),
    path("logout/", views.logout, name="logout"),
    # Password reset endpoints
    path(
        "password-reset/",
        views.PasswordResetRequestView.as_view(),
        name="password-reset-request",
    ),
    path(
        "password-reset-confirm/",
        views.PasswordResetConfirmView.as_view(),
        name="password-reset-confirm",
    ),
    # User management endpoints (includes role management for admins)
    path("", include(router.urls)),
]

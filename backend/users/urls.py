from rest_framework.routers import DefaultRouter

from django.urls import include, path

from . import views

# Create a router for ViewSet-based views
router = DefaultRouter()
router.register(r"users", views.UserViewSet, basename="user")

app_name = "users"


# def trigger_error(request):
#     division_by_zero = 1 / 0


urlpatterns = [
    # Authentication endpoints
    path("auth/register/", views.UserRegistrationView.as_view(), name="register"),
    path("auth/login/", views.UserLoginView.as_view(), name="login"),
    path("auth/logout/", views.logout, name="logout"),
    # path("sentry-debug/", trigger_error),
    # Password reset endpoints
    path(
        "auth/password-reset/",
        views.PasswordResetRequestView.as_view(),
        name="password-reset-request",
    ),
    path(
        "auth/password-reset-confirm/",
        views.PasswordResetConfirmView.as_view(),
        name="password-reset-confirm",
    ),
    # Admin endpoints
    path("admin/statistics/", views.admin_statistics, name="admin-statistics"),
    # Profile endpoint
    path(
        "profile/",
        views.UserViewSet.as_view(
            {"get": "profile", "put": "profile", "patch": "profile"}
        ),
        name="user-profile",
    ),
    # Include router URLs
    path("", include(router.urls)),
]

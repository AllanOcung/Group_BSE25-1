from rest_framework import generics, status, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from django.contrib.auth import authenticate
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode

from users.permissions import IsAdminUser, IsOwnerOrAdmin

from .models import User
from .serializers import (
    PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer,
    UserLoginSerializer,
    UserProfileSerializer,
    UserRegistrationSerializer,
)
from .utils import get_tokens_for_user


class UserRegistrationView(generics.CreateAPIView):
    """User registration endpoint"""

    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate tokens for the new user
        tokens = get_tokens_for_user(user)

        return Response(
            {
                "user": UserProfileSerializer(user).data,
                "tokens": tokens,
                "message": "User registered successfully",
            },
            status=status.HTTP_201_CREATED,
        )


class UserLoginView(generics.GenericAPIView):
    """User login endpoint"""

    serializer_class = UserLoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        user = authenticate(request, username=email, password=password)

        if user:
            if not user.is_active:
                return Response(
                    {"error": "Account is deactivated"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            tokens = get_tokens_for_user(user)
            return Response(
                {
                    "user": UserProfileSerializer(user).data,
                    "tokens": tokens,
                    "message": "Login successful",
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
        )


class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing users with role-based access control
    """

    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ["list", "create", "destroy"]:
            permission_classes = [IsAdminUser]
        elif self.action in ["update", "partial_update", "retrieve"]:
            permission_classes = [IsOwnerOrAdmin]
        elif self.action == "profile":
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticated]

        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """Filter users based on permissions"""
        if self.request.user.is_admin:
            return User.objects.all()
        else:
            # Regular users can only see active users
            return User.objects.filter(is_active=True)

    @action(
        detail=False,
        methods=["get", "put", "patch"],
        permission_classes=[IsAuthenticated],
    )
    def profile(self, request):
        """Get or update current user's profile"""
        if request.method == "GET":
            serializer = UserProfileSerializer(
                request.user, context={"request": request}
            )
            return Response(serializer.data)

        else:  # PUT or PATCH
            serializer = UserProfileSerializer(
                request.user,
                data=request.data,
                partial=(request.method == "PATCH"),
                context={"request": request},
            )
            serializer.is_valid(raise_exception=True)

            # Prevent users from changing their own role (only admins can do this)
            if "role" in serializer.validated_data and not request.user.is_admin:
                raise PermissionDenied("You cannot change your own role.")

            user = serializer.save()
            return Response(
                UserProfileSerializer(user, context={"request": request}).data
            )

    @action(detail=True, methods=["post"], permission_classes=[IsAdminUser])
    def change_role(self, request, pk=None):
        """Change user role (admin only)"""
        user = self.get_object()
        new_role = request.data.get("role")

        if new_role not in [choice[0] for choice in User.Role.choices]:
            return Response(
                {"error": "Invalid role"}, status=status.HTTP_400_BAD_REQUEST
            )

        user.role = new_role
        user.save()

        return Response(
            {
                "message": f"User role changed to {new_role}",
                "user": UserProfileSerializer(user, context={"request": request}).data,
            }
        )

    @action(detail=True, methods=["post"], permission_classes=[IsAdminUser])
    def toggle_active(self, request, pk=None):
        """Activate/deactivate user (admin only)"""
        user = self.get_object()

        # Prevent admins from deactivating themselves
        if user == request.user:
            return Response(
                {"error": "You cannot deactivate your own account"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.is_active = not user.is_active
        user.save()

        status_text = "activated" if user.is_active else "deactivated"
        return Response(
            {
                "message": f"User {status_text} successfully",
                "user": UserProfileSerializer(user, context={"request": request}).data,
            }
        )


# Password reset views remain the same but with better error handling
class PasswordResetRequestView(generics.GenericAPIView):
    """Request password reset"""

    serializer_class = PasswordResetRequestSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"message": "If the email exists, a password reset link has been sent."},
            status=status.HTTP_200_OK,
        )


class PasswordResetConfirmView(generics.GenericAPIView):
    """Confirm password reset with token"""

    serializer_class = PasswordResetConfirmSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            uid = force_str(urlsafe_base64_decode(serializer.validated_data["uid"]))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(
                {"error": "Invalid reset link"}, status=status.HTTP_400_BAD_REQUEST
            )

        if not default_token_generator.check_token(
            user, serializer.validated_data["token"]
        ):
            return Response(
                {"error": "Invalid or expired reset link"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(serializer.validated_data["new_password"])
        user.save()

        return Response(
            {"message": "Password reset successful"}, status=status.HTTP_200_OK
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    """Logout endpoint (client-side token removal)"""
    return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)

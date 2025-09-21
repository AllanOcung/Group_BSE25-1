from rest_framework import serializers

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

User = get_user_model()


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for User profile with role-based access control
    """

    skills_list = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "full_name",
            "bio",
            "skills",
            "skills_list",
            "role",
            "profile_photo",
            "linkedin_url",
            "github_url",
            "personal_website",
            "is_active",
            "date_joined",  # Changed from 'created_at'
            "last_login",
        ]
        read_only_fields = [
            "id",
            "username",
            "email",
            "date_joined",  # Changed from 'created_at'
            "last_login",
        ]
        extra_kwargs = {
            "email": {"read_only": True},
        }

    def get_skills_list(self, obj):
        """Convert comma-separated skills to list"""
        return obj.get_skills_list()

    def get_full_name(self, obj):
        """Get user's full name"""
        return obj.get_full_name()


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration with password confirmation
    """

    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "password_confirm",
            "first_name",
            "last_name",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
            "email": {"required": True},
            "first_name": {"required": True},
            "last_name": {"required": True},
        }

    def validate(self, attrs):
        """Validate that passwords match"""
        password = attrs.get("password")
        password_confirm = attrs.pop("password_confirm", None)

        if password != password_confirm:
            raise serializers.ValidationError("Passwords do not match.")

        return attrs

    def validate_email(self, value):
        """Validate email uniqueness"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        """Create user with default member role"""
        validated_data.pop("password_confirm", None)
        password = validated_data.pop("password")

        user = User.objects.create_user(
            password=password,
            role=User.Role.MEMBER,  # Set default role
            **validated_data,
        )
        return user


class UserLoginSerializer(serializers.Serializer):
    """
    Serializer for user login
    """

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class PasswordResetRequestSerializer(serializers.Serializer):
    """
    Serializer for password reset request
    """

    email = serializers.EmailField()

    def save(self):
        """Send password reset email if user exists"""
        email = self.validated_data["email"]

        try:
            user = User.objects.get(email=email, is_active=True)
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))

            reset_link = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"

            send_mail(
                subject="Password Reset Request",
                message=f"Click the link to reset your password: {reset_link}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=True,
            )
        except User.DoesNotExist:
            # Don't reveal if email exists or not
            pass


class PasswordResetConfirmSerializer(serializers.Serializer):
    """
    Serializer for password reset confirmation
    """

    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(
        write_only=True, validators=[validate_password]
    )
    new_password_confirm = serializers.CharField(write_only=True)

    def validate(self, attrs):
        """Validate that passwords match"""
        password = attrs.get("new_password")
        password_confirm = attrs.get("new_password_confirm")

        if password != password_confirm:
            raise serializers.ValidationError("Passwords do not match.")

        return attrs

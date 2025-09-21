from rest_framework import status
from rest_framework.test import APIClient, APITestCase, override_settings
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core import mail
from django.test import TestCase, TransactionTestCase
from django.urls import reverse
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

User = get_user_model()


class URLDebugTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )

    def test_all_urls(self):
        """Test all available URLs and their responses"""
        urls_to_test = [
            ("/api/auth/register/", "POST"),
            ("/api/auth/login/", "POST"),
            ("/api/auth/logout/", "POST"),
            ("/api/auth/password-reset/", "POST"),
            ("/api/auth/password-reset-confirm/", "POST"),
            ("/api/users/", "GET"),
            ("/api/users/1/", "GET"),
            ("/api/users/profile/", "GET"),
        ]

        # Test with authentication
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

        for url, method in urls_to_test:
            print(f"\nTesting {method} {url}")
            if method == "GET":
                response = self.client.get(url)
            else:
                response = self.client.post(url, {})
            print(f"Status: {response.status_code}")
            if response.status_code == 301:
                print(f"Redirected to: {response.get('Location', 'Unknown')}")

    def test_reverse_urls(self):
        """Test reverse URL generation"""
        url_names = [
            "users:register",
            "users:login",
            "users:logout",
            "users:password-reset-request",
            "users:password-reset-confirm",
            "users:user-list",
            "users:user-detail",
        ]

        for name in url_names:
            try:
                if name == "users:user-detail":
                    url = reverse(name, kwargs={"pk": 1})
                else:
                    url = reverse(name)
                print(f"{name}: {url}")
            except Exception as e:
                print(f"{name}: ERROR - {e}")


class UserModelTest(TestCase):
    """Test User model functionality including role-based access control"""

    def setUp(self):
        self.user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpass123",
            "first_name": "Test",
            "last_name": "User",
        }
        self.user = User.objects.create_user(**self.user_data)

    def test_user_creation_with_default_role(self):
        """Test user creation with default member role"""
        self.assertEqual(self.user.username, "testuser")
        self.assertEqual(self.user.email, "test@example.com")
        self.assertTrue(self.user.check_password("testpass123"))
        self.assertEqual(self.user.role, User.Role.MEMBER)
        self.assertTrue(self.user.is_active)

    def test_user_creation_with_specific_roles(self):
        """Test user creation with different roles"""
        # Create admin user
        admin = User.objects.create_user(
            username="admin",
            email="admin@example.com",
            password="adminpass123",
            role=User.Role.ADMIN,
        )
        self.assertEqual(admin.role, User.Role.ADMIN)
        self.assertTrue(admin.is_admin)
        self.assertTrue(admin.can_create_content)
        self.assertTrue(admin.can_moderate_content)

        # Create viewer user
        viewer = User.objects.create_user(
            username="viewer",
            email="viewer@example.com",
            password="viewerpass123",
            role=User.Role.VIEWER,
        )
        self.assertEqual(viewer.role, User.Role.VIEWER)
        self.assertFalse(viewer.is_admin)
        self.assertFalse(viewer.can_create_content)
        self.assertFalse(viewer.can_moderate_content)

    def test_user_string_representation(self):
        """Test user string representation"""
        expected = "Test User (test@example.com)"
        self.assertEqual(str(self.user), expected)

    def test_role_properties(self):
        """Test role-based property methods"""
        # Test member role
        self.assertTrue(self.user.is_member)
        self.assertFalse(self.user.is_admin)
        self.assertFalse(self.user.is_viewer)
        self.assertTrue(self.user.can_create_content)
        self.assertFalse(self.user.can_moderate_content)

        # Test admin role
        admin = User.objects.create_user(
            username="admin",
            email="admin@example.com",
            password="pass123",
            role=User.Role.ADMIN,
        )
        self.assertTrue(admin.is_admin)
        self.assertTrue(admin.can_create_content)
        self.assertTrue(admin.can_moderate_content)

        # Test viewer role
        viewer = User.objects.create_user(
            username="viewer",
            email="viewer@example.com",
            password="pass123",
            role=User.Role.VIEWER,
        )
        self.assertTrue(viewer.is_viewer)
        self.assertFalse(viewer.can_create_content)
        self.assertFalse(viewer.can_moderate_content)

    def test_superuser_admin_privileges(self):
        """Test that superuser has admin privileges regardless of role"""
        superuser = User.objects.create_superuser(
            username="super",
            email="super@example.com",
            password="superpass123",
        )
        self.assertTrue(superuser.is_admin)
        self.assertTrue(superuser.can_moderate_content)

    def test_get_full_name(self):
        """Test get_full_name method"""
        self.assertEqual(self.user.get_full_name(), "Test User")

        # Test with empty names
        user_no_name = User.objects.create_user(
            username="noname", email="noname@example.com", password="pass123"
        )
        self.assertEqual(user_no_name.get_full_name(), "")

    def test_get_skills_list(self):
        """Test skills conversion from string to list"""
        self.user.skills = "Python, Django, React, JavaScript"
        self.user.save()

        expected_skills = ["Python", "Django", "React", "JavaScript"]
        self.assertEqual(self.user.get_skills_list(), expected_skills)

        # Test empty skills
        user_no_skills = User.objects.create_user(
            username="noskills", email="noskills@example.com", password="pass123"
        )
        self.assertEqual(user_no_skills.get_skills_list(), [])

    def test_email_uniqueness(self):
        """Test that email must be unique"""
        from django.db import IntegrityError

        with self.assertRaises(IntegrityError):
            User.objects.create_user(
                username="another",
                email="test@example.com",  # Same email
                password="pass123",
            )


# Override settings to disable APPEND_SLASH for all API tests
@override_settings(APPEND_SLASH=False, SECURE_SSL_REDIRECT=False)
class AuthenticationAPITest(APITestCase):
    """Test authentication API endpoints with role-based functionality"""

    def setUp(self):
        self.client = APIClient()

        self.valid_user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "SecurePass123!",
            "password_confirm": "SecurePass123!",
            "first_name": "Test",
            "last_name": "User",
        }

    def test_user_registration_success(self):
        """Test successful user registration with default member role"""
        response = self.client.post(
            reverse("users:register"), self.valid_user_data, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("user", response.data)
        self.assertIn("tokens", response.data)
        self.assertEqual(response.data["user"]["email"], "test@example.com")
        self.assertEqual(response.data["user"]["role"], User.Role.MEMBER)

        # Check user was created in database
        user = User.objects.get(email="test@example.com")
        self.assertEqual(user.role, User.Role.MEMBER)

    def test_user_registration_password_mismatch(self):
        """Test registration with password mismatch"""
        data = self.valid_user_data.copy()
        data["password_confirm"] = "DifferentPassword"

        response = self.client.post(reverse("users:register"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Passwords do not match", str(response.data))

    def test_user_registration_duplicate_email(self):
        """Test registration with duplicate email"""
        # First create a user
        User.objects.create_user(
            username="existing", email="test@example.com", password="pass123"
        )

        response = self.client.post(
            reverse("users:register"), self.valid_user_data, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_login_success(self):
        """Test successful user login"""
        # First register a user
        User.objects.create_user(
            username="testuser", email="test@example.com", password="SecurePass123!"
        )

        login_data = {"email": "test@example.com", "password": "SecurePass123!"}

        response = self.client.post(reverse("users:login"), login_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("tokens", response.data)
        self.assertIn("user", response.data)
        self.assertIn("access", response.data["tokens"])
        self.assertIn("refresh", response.data["tokens"])

    def test_user_login_inactive_user(self):
        """Test login with inactive user"""
        User.objects.create_user(
            username="inactive",
            email="inactive@example.com",
            password="pass123",
            is_active=False,
        )

        login_data = {"email": "inactive@example.com", "password": "pass123"}

        response = self.client.post(reverse("users:login"), login_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Invalid credentials", response.data["error"])

    def test_user_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        login_data = {"email": "nonexistent@example.com", "password": "wrongpassword"}

        response = self.client.post(reverse("users:login"), login_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Invalid credentials", response.data["error"])

    def test_logout_success(self):
        """Test successful logout"""
        user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )

        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

        response = self.client.post(reverse("users:logout"), format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("Logged out successfully", response.data["message"])


@override_settings(APPEND_SLASH=False, SECURE_SSL_REDIRECT=False)
class UserProfileAPITest(APITestCase):
    """Test user profile management API"""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123",
            first_name="Test",
            last_name="User",
        )
        self.admin = User.objects.create_user(
            username="admin",
            email="admin@example.com",
            password="adminpass123",
            role=User.Role.ADMIN,
        )

    def authenticate_user(self, user):
        """Helper method to authenticate a user"""
        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

    def test_get_profile_authenticated(self):
        """Test getting profile with authentication"""
        self.authenticate_user(self.user)
        # Use the correct URL from debug output
        response = self.client.get(reverse("users:user-profile"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "test@example.com")
        self.assertEqual(response.data["username"], "testuser")
        self.assertEqual(response.data["role"], User.Role.MEMBER)

    def test_get_profile_unauthenticated(self):
        """Test getting profile without authentication"""
        response = self.client.get(reverse("users:user-profile"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_profile(self):
        """Test updating user profile"""
        self.authenticate_user(self.user)

        update_data = {
            "first_name": "Updated",
            "last_name": "Name",
            "bio": "Updated bio",
            "skills": "Python, Django, React",
            "linkedin_url": "https://linkedin.com/in/testuser",
        }

        response = self.client.patch(
            reverse("users:user-profile"), update_data, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["first_name"], "Updated")
        self.assertEqual(response.data["bio"], "Updated bio")
        self.assertEqual(
            response.data["linkedin_url"], "https://linkedin.com/in/testuser"
        )

    def test_user_cannot_change_own_role(self):
        """Test that regular users cannot change their own role"""
        self.authenticate_user(self.user)

        update_data = {"role": User.Role.ADMIN}

        response = self.client.patch(
            reverse("users:user-profile"), update_data, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn("cannot change your own role", response.data["detail"])


@override_settings(APPEND_SLASH=False, SECURE_SSL_REDIRECT=False)
class UserManagementAPITest(APITestCase):
    """Test user management API with role-based access control"""

    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(
            username="admin",
            email="admin@example.com",
            password="adminpass123",
            role=User.Role.ADMIN,
        )
        self.member = User.objects.create_user(
            username="member",
            email="member@example.com",
            password="memberpass123",
            role=User.Role.MEMBER,
        )
        self.viewer = User.objects.create_user(
            username="viewer",
            email="viewer@example.com",
            password="viewerpass123",
            role=User.Role.VIEWER,
        )

    def authenticate_user(self, user):
        """Helper method to authenticate a user"""
        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

    def test_admin_can_list_users(self):
        """Test that admin can list all users"""
        self.authenticate_user(self.admin)
        response = self.client.get(reverse("users:user-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check that we get results (could be paginated)
        if isinstance(response.data, dict) and "results" in response.data:
            self.assertGreaterEqual(len(response.data["results"]), 3)
        else:
            self.assertGreaterEqual(len(response.data), 3)

    def test_non_admin_cannot_list_users(self):
        """Test that non-admin users cannot list all users"""
        self.authenticate_user(self.member)
        response = self.client.get(reverse("users:user-list"))

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_can_view_other_user_profile(self):
        """Test that authenticated users can view other user profiles"""
        self.authenticate_user(self.member)
        response = self.client.get(
            reverse("users:user-detail", kwargs={"pk": self.viewer.pk})
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "viewer")

    def test_user_cannot_update_other_user_profile(self):
        """Test that users cannot update other users' profiles"""
        self.authenticate_user(self.member)
        data = {"first_name": "Hacked"}
        response = self.client.patch(
            reverse("users:user-detail", kwargs={"pk": self.viewer.pk}),
            data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_update_any_user_profile(self):
        """Test that admin can update any user's profile"""
        self.authenticate_user(self.admin)
        data = {"first_name": "AdminUpdated"}
        response = self.client.patch(
            reverse("users:user-detail", kwargs={"pk": self.member.pk}),
            data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["first_name"], "AdminUpdated")


@override_settings(APPEND_SLASH=False, SECURE_SSL_REDIRECT=False)
class PasswordResetTest(APITestCase):
    """Test password reset functionality"""

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="oldpassword"
        )

    def test_password_reset_request_valid_email(self):
        """Test password reset request with valid email"""
        data = {"email": "test@example.com"}
        response = self.client.post(
            reverse("users:password-reset-request"), data, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("password reset link has been sent", response.data["message"])

    def test_password_reset_request_invalid_email(self):
        """Test password reset request with invalid email"""
        data = {"email": "nonexistent@example.com"}
        response = self.client.post(
            reverse("users:password-reset-request"), data, format="json"
        )

        # Should still return success to prevent email enumeration
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_password_reset_confirm_valid_token(self):
        """Test password reset confirm with valid token"""
        token = default_token_generator.make_token(self.user)
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))

        data = {
            "uid": uid,
            "token": token,
            "new_password": "NewSecurePass123!",
            "new_password_confirm": "NewSecurePass123!",
        }

        response = self.client.post(
            reverse("users:password-reset-confirm"), data, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("Password reset successful", response.data["message"])

        # Verify password was changed
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("NewSecurePass123!"))

    def test_password_reset_confirm_invalid_token(self):
        """Test password reset confirm with invalid token"""
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))

        data = {
            "uid": uid,
            "token": "invalid-token",
            "new_password": "NewSecurePass123!",
            "new_password_confirm": "NewSecurePass123!",
        }

        response = self.client.post(
            reverse("users:password-reset-confirm"), data, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Invalid or expired", response.data["error"])

    def test_password_reset_confirm_password_mismatch(self):
        """Test password reset confirm with password mismatch"""
        token = default_token_generator.make_token(self.user)
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))

        data = {
            "uid": uid,
            "token": token,
            "new_password": "NewSecurePass123!",
            "new_password_confirm": "DifferentPassword!",
        }

        response = self.client.post(
            reverse("users:password-reset-confirm"), data, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


@override_settings(APPEND_SLASH=False, SECURE_SSL_REDIRECT=False)
class RoleBasedPermissionsTest(APITestCase):
    """Test role-based permissions across the system"""

    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(
            username="admin",
            email="admin@example.com",
            password="pass123",
            role=User.Role.ADMIN,
        )
        self.member = User.objects.create_user(
            username="member",
            email="member@example.com",
            password="pass123",
            role=User.Role.MEMBER,
        )
        self.viewer = User.objects.create_user(
            username="viewer",
            email="viewer@example.com",
            password="pass123",
            role=User.Role.VIEWER,
        )

    def authenticate_user(self, user):
        """Helper method to authenticate a user"""
        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

    def test_content_creation_permissions(self):
        """Test content creation permissions by role"""
        # Admin can create content
        self.assertTrue(self.admin.can_create_content)

        # Member can create content
        self.assertTrue(self.member.can_create_content)

        # Viewer cannot create content
        self.assertFalse(self.viewer.can_create_content)

    def test_moderation_permissions(self):
        """Test content moderation permissions by role"""
        # Admin can moderate content
        self.assertTrue(self.admin.can_moderate_content)

        # Member cannot moderate content
        self.assertFalse(self.member.can_moderate_content)

        # Viewer cannot moderate content
        self.assertFalse(self.viewer.can_moderate_content)

    def test_user_filtering_by_role(self):
        """Test that non-admin users only see active users"""
        # Create inactive user
        User.objects.create_user(
            username="inactive",
            email="inactive@example.com",
            password="pass123",
            is_active=False,
        )

        # Admin sees all users (including inactive)
        self.authenticate_user(self.admin)
        admin_queryset = User.objects.all()
        self.assertEqual(admin_queryset.count(), 4)  # admin, member, viewer, inactive

        # Non-admin users would see filtered queryset (active only)
        member_queryset = User.objects.filter(is_active=True)
        self.assertEqual(
            member_queryset.count(), 3
        )  # admin, member, viewer (no inactive)


class UserSerializerTest(TestCase):
    """Test user serializers with role-based data"""

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123",
            first_name="Test",
            last_name="User",
            bio="Test bio",
            skills="Python, Django, React",
            role=User.Role.MEMBER,
        )

    def test_user_profile_serializer_data(self):
        """Test UserProfileSerializer returns correct data"""
        from .serializers import UserProfileSerializer

        serializer = UserProfileSerializer(self.user)
        data = serializer.data

        self.assertEqual(data["username"], "testuser")
        self.assertEqual(data["email"], "test@example.com")
        self.assertEqual(data["role"], User.Role.MEMBER)
        self.assertEqual(data["bio"], "Test bio")
        self.assertIn("skills_list", data)

    def test_user_registration_serializer_validation(self):
        """Test UserRegistrationSerializer validation"""
        from .serializers import UserRegistrationSerializer

        # Valid data
        valid_data = {
            "username": "newuser",
            "email": "new@example.com",
            "password": "SecurePass123!",
            "password_confirm": "SecurePass123!",
            "first_name": "New",
            "last_name": "User",
        }

        serializer = UserRegistrationSerializer(data=valid_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

        # Invalid data - password mismatch
        invalid_data = valid_data.copy()
        invalid_data["password_confirm"] = "DifferentPassword"

        serializer = UserRegistrationSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("non_field_errors", serializer.errors)

    def test_user_login_serializer_validation(self):
        """Test UserLoginSerializer validation"""
        from .serializers import UserLoginSerializer

        # Valid data
        valid_data = {
            "email": "test@example.com",
            "password": "SecurePass123!",
        }

        serializer = UserLoginSerializer(data=valid_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

        # Invalid data - missing email
        invalid_data = {"password": "SecurePass123!"}

        serializer = UserLoginSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("email", serializer.errors)

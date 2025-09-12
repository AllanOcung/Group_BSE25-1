from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core import mail
from django.test import TestCase, TransactionTestCase
from django.urls import reverse
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

User = get_user_model()


class UserModelTest(TestCase):
    """Test User model functionality"""

    def setUp(self):
        self.user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpass123",
            "first_name": "Test",
            "last_name": "User",
        }
        self.user = User.objects.create_user(**self.user_data)

    def test_user_creation(self):
        """Test user creation with valid data"""
        self.assertEqual(self.user.username, "testuser")
        self.assertEqual(self.user.email, "test@example.com")
        self.assertTrue(self.user.check_password("testpass123"))
        self.assertEqual(self.user.role, "user")
        self.assertTrue(self.user.is_active)

    def test_user_string_representation(self):
        """Test user string representation"""
        expected = f"{self.user.username} ({self.user.email})"
        self.assertEqual(str(self.user), expected)

    def test_is_admin_method(self):
        """Test is_admin method"""
        self.assertFalse(self.user.is_admin())

        admin_user = User.objects.create_user(
            username="admin",
            email="admin@example.com",
            password="adminpass123",
            role="admin",
        )
        self.assertTrue(admin_user.is_admin())

    def test_get_full_name(self):
        """Test get_full_name method"""
        self.assertEqual(self.user.get_full_name(), "Test User")

        # Test with empty names
        user_no_name = User.objects.create_user(
            username="noname", email="noname@example.com", password="pass123"
        )
        self.assertEqual(user_no_name.get_full_name(), "")

    def test_email_uniqueness(self):
        """Test that email must be unique"""
        with self.assertRaises(Exception):
            User.objects.create_user(
                username="another",
                email="test@example.com",  # Same email
                password="pass123",
            )


class AuthenticationAPITest(APITestCase):
    """Test authentication API endpoints"""

    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse("register")
        self.login_url = reverse("login")
        self.logout_url = reverse("logout")
        self.profile_url = reverse("profile")

        self.valid_user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "SecurePass123!",
            "password_confirm": "SecurePass123!",
            "first_name": "Test",
            "last_name": "User",
        }

    def test_user_registration_success(self):
        """Test successful user registration"""
        response = self.client.post(self.register_url, self.valid_user_data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("user", response.data)
        self.assertIn("tokens", response.data)
        self.assertEqual(response.data["user"]["email"], "test@example.com")

        # Check user was created in database
        self.assertTrue(User.objects.filter(email="test@example.com").exists())

    def test_user_registration_password_mismatch(self):
        """Test registration with password mismatch"""
        data = self.valid_user_data.copy()
        data["password_confirm"] = "DifferentPassword"

        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("non_field_errors", response.data)

    def test_user_registration_weak_password(self):
        """Test registration with weak password"""
        data = self.valid_user_data.copy()
        data["password"] = "123"
        data["password_confirm"] = "123"

        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_registration_duplicate_email(self):
        """Test registration with duplicate email"""
        # Create first user
        self.client.post(self.register_url, self.valid_user_data)

        # Try to create second user with same email
        data = self.valid_user_data.copy()
        data["username"] = "different"

        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_login_success(self):
        """Test successful user login"""
        # First register a user
        User.objects.create_user(
            username="testuser", email="test@example.com", password="SecurePass123!"
        )

        login_data = {"email": "test@example.com", "password": "SecurePass123!"}

        response = self.client.post(self.login_url, login_data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("tokens", response.data)
        self.assertIn("user", response.data)
        self.assertIn("access", response.data["tokens"])
        self.assertIn("refresh", response.data["tokens"])

    def test_user_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        login_data = {"email": "nonexistent@example.com", "password": "wrongpassword"}

        response = self.client.post(self.login_url, login_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_login_inactive_user(self):
        """Test login with inactive user"""
        User.objects.create_user(
            username="inactive",
            email="inactive@example.com",
            password="pass123",
            is_active=False,
        )

        login_data = {"email": "inactive@example.com", "password": "pass123"}

        response = self.client.post(self.login_url, login_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_profile_access_authenticated(self):
        """Test profile access with authentication"""
        user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )

        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

        response = self.client.get(self.profile_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "test@example.com")
        self.assertEqual(response.data["username"], "testuser")

    def test_profile_access_unauthenticated(self):
        """Test profile access without authentication"""
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_profile_update(self):
        """Test profile update"""
        user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )

        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

        update_data = {
            "first_name": "Updated",
            "last_name": "Name",
            "bio": "Updated bio",
            "skills": ["Python", "Django", "React"],
        }

        response = self.client.put(self.profile_url, update_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["first_name"], "Updated")
        self.assertEqual(response.data["bio"], "Updated bio")
        self.assertEqual(response.data["skills"], ["Python", "Django", "React"])

    def test_logout_success(self):
        """Test successful logout"""
        user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )

        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

        logout_data = {"refresh": str(refresh)}

        response = self.client.post(self.logout_url, logout_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_logout_invalid_token(self):
        """Test logout with invalid token"""
        user = User.objects.create_user(
            username="testuser", email="test@example.com", password="testpass123"
        )

        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

        logout_data = {"refresh": "invalid-token"}

        response = self.client.post(self.logout_url, logout_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class PasswordResetTest(APITestCase):
    """Test password reset functionality"""

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="oldpassword"
        )
        self.reset_request_url = reverse("password_reset_request")

    def test_password_reset_request_valid_email(self):
        """Test password reset request with valid email"""
        data = {"email": "test@example.com"}

        response = self.client.post(self.reset_request_url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("message", response.data)

    def test_password_reset_request_invalid_email(self):
        """Test password reset request with invalid email"""
        data = {"email": "nonexistent@example.com"}

        response = self.client.post(self.reset_request_url, data)

        # Should still return success to prevent email enumeration
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_password_reset_confirm_valid_token(self):
        """Test password reset confirm with valid token"""
        token = default_token_generator.make_token(self.user)
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))

        url = reverse("password_reset_confirm", kwargs={"uidb64": uid, "token": token})

        data = {
            "new_password": "NewSecurePass123!",
            "new_password_confirm": "NewSecurePass123!",
        }

        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify password was changed
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("NewSecurePass123!"))

    def test_password_reset_confirm_invalid_token(self):
        """Test password reset confirm with invalid token"""
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))

        url = reverse(
            "password_reset_confirm", kwargs={"uidb64": uid, "token": "invalid-token"}
        )

        data = {
            "new_password": "NewSecurePass123!",
            "new_password_confirm": "NewSecurePass123!",
        }

        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

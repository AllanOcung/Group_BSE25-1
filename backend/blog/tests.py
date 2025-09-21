from rest_framework import status
from rest_framework.test import APIClient, APITestCase, override_settings
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.urls import reverse

from .models import Post, Project

User = get_user_model()


class ProjectModelTest(TestCase):
    """Test Project model functionality"""

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123",
            first_name="Test",
            last_name="User",
        )
        self.project_data = {
            "owner": self.user,
            "title": "Test Project",
            "description": "This is a test project",
            "tech_stack": "Python, Django, React",
            "demo_link": "https://example.com/demo",
            "source_code": "https://github.com/test/project",
        }

    def test_project_creation(self):
        """Test project creation"""
        project = Project.objects.create(**self.project_data)

        self.assertEqual(project.title, "Test Project")
        self.assertEqual(project.owner, self.user)
        self.assertEqual(project.tech_stack, "Python, Django, React")
        self.assertIsNotNone(project.created_at)
        self.assertIsNotNone(project.updated_at)

    def test_project_string_representation(self):
        """Test project string representation"""
        project = Project.objects.create(**self.project_data)
        self.assertEqual(str(project), "Test Project")

    def test_project_owner_relationship(self):
        """Test project-user relationship"""
        project = Project.objects.create(**self.project_data)
        self.assertEqual(project.owner.projects.first(), project)


class PostModelTest(TestCase):
    """Test Post model functionality"""

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123",
            first_name="Test",
            last_name="User",
        )
        self.post_data = {
            "author": self.user,
            "title": "Test Blog Post",
            "content": "This is a test blog post content",
            "tags": "python, django, testing",
            "is_published": True,
        }

    def test_post_creation(self):
        """Test post creation"""
        post = Post.objects.create(**self.post_data)

        self.assertEqual(post.title, "Test Blog Post")
        self.assertEqual(post.author, self.user)
        self.assertEqual(post.tags, "python, django, testing")
        self.assertTrue(post.is_published)
        self.assertIsNotNone(post.created_at)
        self.assertIsNotNone(post.updated_at)

    def test_post_string_representation(self):
        """Test post string representation"""
        post = Post.objects.create(**self.post_data)
        self.assertEqual(str(post), "Test Blog Post")

    def test_post_author_relationship(self):
        """Test post-user relationship"""
        post = Post.objects.create(**self.post_data)
        self.assertEqual(post.author.posts.first(), post)


@override_settings(APPEND_SLASH=False, SECURE_SSL_REDIRECT=False)
class ProjectAPITest(APITestCase):
    """Test Project API endpoints"""

    def setUp(self):
        self.client = APIClient()

        # Create users with different roles
        self.admin = User.objects.create_user(
            username="admin",
            email="admin@example.com",
            password="adminpass123",
            role=User.Role.ADMIN,
            first_name="Admin",
            last_name="User",
        )

        self.member = User.objects.create_user(
            username="member",
            email="member@example.com",
            password="memberpass123",
            role=User.Role.MEMBER,
            first_name="Member",
            last_name="User",
        )

        self.viewer = User.objects.create_user(
            username="viewer",
            email="viewer@example.com",
            password="viewerpass123",
            role=User.Role.VIEWER,
            first_name="Viewer",
            last_name="User",
        )

        # Create test projects
        self.project1 = Project.objects.create(
            owner=self.member,
            title="Django Project",
            description="A Django web application",
            tech_stack="Python, Django, PostgreSQL",
            demo_link="https://example.com/demo1",
            source_code="https://github.com/user/project1",
        )

        self.project2 = Project.objects.create(
            owner=self.admin,
            title="React Project",
            description="A React frontend application",
            tech_stack="JavaScript, React, Node.js",
            demo_link="https://example.com/demo2",
            source_code="https://github.com/user/project2",
        )

        self.valid_project_data = {
            "title": "New Test Project",
            "description": "This is a new test project",
            "tech_stack": "Python, Flask, SQLite",
            "demo_link": "https://example.com/new-demo",
            "source_code": "https://github.com/user/new-project",
        }

    def authenticate_user(self, user):
        """Helper method to authenticate a user"""
        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

    def test_list_projects_unauthenticated(self):
        """Test listing projects without authentication"""
        response = self.client.get(reverse("blog:project-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 2)

    def test_list_projects_authenticated(self):
        """Test listing projects with authentication"""
        self.authenticate_user(self.member)
        response = self.client.get(reverse("blog:project-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 2)

    def test_retrieve_project(self):
        """Test retrieving a single project"""
        response = self.client.get(
            reverse("blog:project-detail", kwargs={"pk": self.project1.pk})
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Django Project")
        self.assertEqual(response.data["owner"]["username"], "member")

    def test_create_project_as_member(self):
        """Test creating a project as a member (should succeed)"""
        self.authenticate_user(self.member)
        response = self.client.post(
            reverse("blog:project-list"), self.valid_project_data, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "New Test Project")
        self.assertEqual(response.data["owner"]["username"], "member")

        # Verify project was created in database
        project = Project.objects.get(title="New Test Project")
        self.assertEqual(project.owner, self.member)

    def test_create_project_as_viewer(self):
        """Test creating a project as a viewer (should fail)"""
        self.authenticate_user(self.viewer)
        response = self.client.post(
            reverse("blog:project-list"), self.valid_project_data, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_project_unauthenticated(self):
        """Test creating a project without authentication (should fail)"""
        response = self.client.post(
            reverse("blog:project-list"), self.valid_project_data, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_own_project(self):
        """Test updating own project"""
        self.authenticate_user(self.member)
        update_data = {"title": "Updated Django Project"}
        response = self.client.patch(
            reverse("blog:project-detail", kwargs={"pk": self.project1.pk}),
            update_data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Updated Django Project")

    def test_update_other_user_project_as_member(self):
        """Test updating another user's project as member (should fail)"""
        self.authenticate_user(self.member)
        update_data = {"title": "Hacked Project"}
        response = self.client.patch(
            reverse("blog:project-detail", kwargs={"pk": self.project2.pk}),
            update_data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_any_project_as_admin(self):
        """Test updating any project as admin (should succeed)"""
        self.authenticate_user(self.admin)
        update_data = {"title": "Admin Updated Project"}
        response = self.client.patch(
            reverse("blog:project-detail", kwargs={"pk": self.project1.pk}),
            update_data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Admin Updated Project")

    def test_delete_own_project(self):
        """Test deleting own project"""
        self.authenticate_user(self.member)
        response = self.client.delete(
            reverse("blog:project-detail", kwargs={"pk": self.project1.pk})
        )

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Project.objects.filter(pk=self.project1.pk).exists())

    def test_delete_other_user_project_as_member(self):
        """Test deleting another user's project as member (should fail)"""
        self.authenticate_user(self.member)
        response = self.client.delete(
            reverse("blog:project-detail", kwargs={"pk": self.project2.pk})
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(Project.objects.filter(pk=self.project2.pk).exists())

    def test_my_projects_endpoint(self):
        """Test my_projects custom action"""
        self.authenticate_user(self.member)
        response = self.client.get(reverse("blog:project-my-projects"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Django Project")

    def test_featured_projects_endpoint(self):
        """Test featured projects endpoint"""
        response = self.client.get(reverse("blog:project-featured"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertLessEqual(len(response.data), 6)

    def test_technologies_endpoint(self):
        """Test technologies endpoint"""
        response = self.client.get(reverse("blog:project-technologies"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("Python", response.data)
        self.assertIn("Django", response.data)
        self.assertIn("React", response.data)

    def test_filter_projects_by_tech(self):
        """Test filtering projects by technology"""
        response = self.client.get(reverse("blog:project-list") + "?tech=Django")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Django Project")

    def test_search_projects(self):
        """Test searching projects"""
        response = self.client.get(reverse("blog:project-list") + "?search=Django")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)


@override_settings(APPEND_SLASH=False, SECURE_SSL_REDIRECT=False)
class PostAPITest(APITestCase):
    """Test Post API endpoints"""

    def setUp(self):
        self.client = APIClient()

        # Create users with different roles
        self.admin = User.objects.create_user(
            username="admin",
            email="admin@example.com",
            password="adminpass123",
            role=User.Role.ADMIN,
            first_name="Admin",
            last_name="User",
        )

        self.member = User.objects.create_user(
            username="member",
            email="member@example.com",
            password="memberpass123",
            role=User.Role.MEMBER,
            first_name="Member",
            last_name="User",
        )

        self.viewer = User.objects.create_user(
            username="viewer",
            email="viewer@example.com",
            password="viewerpass123",
            role=User.Role.VIEWER,
            first_name="Viewer",
            last_name="User",
        )

        # Create test posts
        self.published_post = Post.objects.create(
            author=self.member,
            title="Published Django Post",
            content="This is a published post about Django development",
            tags="python, django, web",
            is_published=True,
        )

        self.unpublished_post = Post.objects.create(
            author=self.member,
            title="Draft Post",
            content="This is a draft post",
            tags="draft, wip",
            is_published=False,
        )

        self.admin_post = Post.objects.create(
            author=self.admin,
            title="Admin Post",
            content="This is an admin post",
            tags="admin, announcement",
            is_published=True,
        )

        self.valid_post_data = {
            "title": "New Blog Post",
            "content": "This is a new blog post content with detailed information.",
            "tags": "testing, api, django",
            "is_published": True,
        }

    def authenticate_user(self, user):
        """Helper method to authenticate a user"""
        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

    def test_list_posts_unauthenticated(self):
        """Test listing posts without authentication (only published)"""
        response = self.client.get(reverse("blog:post-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should only see published posts
        titles = [post["title"] for post in response.data]
        self.assertIn("Published Django Post", titles)
        self.assertIn("Admin Post", titles)
        self.assertNotIn("Draft Post", titles)

    def test_list_posts_authenticated(self):
        """Test listing posts with authentication (only published)"""
        self.authenticate_user(self.member)
        response = self.client.get(reverse("blog:post-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should still only see published posts in list view
        titles = [post["title"] for post in response.data]
        self.assertIn("Published Django Post", titles)
        self.assertNotIn("Draft Post", titles)

    def test_retrieve_published_post(self):
        """Test retrieving a published post"""
        response = self.client.get(
            reverse("blog:post-detail", kwargs={"pk": self.published_post.pk})
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Published Django Post")
        self.assertEqual(response.data["author"]["username"], "member")

    def test_retrieve_unpublished_post_unauthenticated(self):
        """Test retrieving unpublished post without authentication"""
        response = self.client.get(
            reverse("blog:post-detail", kwargs={"pk": self.unpublished_post.pk})
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_post_as_member(self):
        """Test creating a post as a member (should succeed)"""
        self.authenticate_user(self.member)
        response = self.client.post(
            reverse("blog:post-list"), self.valid_post_data, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "New Blog Post")
        self.assertEqual(response.data["author"]["username"], "member")

        # Verify post was created in database
        post = Post.objects.get(title="New Blog Post")
        self.assertEqual(post.author, self.member)

    def test_create_post_as_viewer(self):
        """Test creating a post as a viewer (should fail)"""
        self.authenticate_user(self.viewer)
        response = self.client.post(
            reverse("blog:post-list"), self.valid_post_data, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_post_unauthenticated(self):
        """Test creating a post without authentication (should fail)"""
        response = self.client.post(
            reverse("blog:post-list"), self.valid_post_data, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_own_post(self):
        """Test updating own post"""
        self.authenticate_user(self.member)
        update_data = {"title": "Updated Django Post"}
        response = self.client.patch(
            reverse("blog:post-detail", kwargs={"pk": self.published_post.pk}),
            update_data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Updated Django Post")

    def test_update_other_user_post_as_member(self):
        """Test updating another user's post as member (should fail)"""
        self.authenticate_user(self.member)
        update_data = {"title": "Hacked Post"}
        response = self.client.patch(
            reverse("blog:post-detail", kwargs={"pk": self.admin_post.pk}),
            update_data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_any_post_as_admin(self):
        """Test updating any post as admin (should succeed)"""
        self.authenticate_user(self.admin)
        update_data = {"title": "Admin Updated Post"}
        response = self.client.patch(
            reverse("blog:post-detail", kwargs={"pk": self.published_post.pk}),
            update_data,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Admin Updated Post")

    def test_delete_own_post(self):
        """Test deleting own post"""
        self.authenticate_user(self.member)
        response = self.client.delete(
            reverse("blog:post-detail", kwargs={"pk": self.published_post.pk})
        )

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Post.objects.filter(pk=self.published_post.pk).exists())

    def test_delete_other_user_post_as_member(self):
        """Test deleting another user's post as member (should fail)"""
        self.authenticate_user(self.member)
        response = self.client.delete(
            reverse("blog:post-detail", kwargs={"pk": self.admin_post.pk})
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(Post.objects.filter(pk=self.admin_post.pk).exists())

    def test_my_posts_endpoint(self):
        """Test my_posts custom action"""
        self.authenticate_user(self.member)
        response = self.client.get(reverse("blog:post-my-posts"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Both published and unpublished
        titles = [post["title"] for post in response.data]
        self.assertIn("Published Django Post", titles)
        self.assertIn("Draft Post", titles)

    def test_featured_posts_endpoint(self):
        """Test featured posts endpoint"""
        response = self.client.get(reverse("blog:post-featured"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertLessEqual(len(response.data), 6)

    def test_tags_endpoint(self):
        """Test tags endpoint"""
        response = self.client.get(reverse("blog:post-tags"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("python", response.data)
        self.assertIn("django", response.data)
        self.assertIn("admin", response.data)

    def test_toggle_publish_own_post(self):
        """Test toggling publish status of own post"""
        self.authenticate_user(self.member)
        response = self.client.post(
            reverse("blog:post-toggle-publish", kwargs={"pk": self.published_post.pk})
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["is_published"])

        # Verify in database
        self.published_post.refresh_from_db()
        self.assertFalse(self.published_post.is_published)

    def test_toggle_publish_other_user_post_as_member(self):
        """Test toggling publish status of other user's post as member (should fail)"""
        self.authenticate_user(self.member)
        response = self.client.post(
            reverse("blog:post-toggle-publish", kwargs={"pk": self.admin_post.pk})
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_filter_posts_by_tag(self):
        """Test filtering posts by tag"""
        response = self.client.get(reverse("blog:post-list") + "?tag=django")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Published Django Post")

    def test_search_posts(self):
        """Test searching posts"""
        response = self.client.get(reverse("blog:post-list") + "?search=Django")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)


@override_settings(APPEND_SLASH=False, SECURE_SSL_REDIRECT=False)
class BlogAPIViewsTest(APITestCase):
    """Test blog API views (search, stats, etc.)"""

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

        # Create test content
        self.project = Project.objects.create(
            owner=self.member,
            title="Test Project",
            description="A test project for searching",
            tech_stack="Python, Django",
        )

        self.post = Post.objects.create(
            author=self.member,
            title="Test Post",
            content="A test blog post for searching",
            tags="testing, api",
            is_published=True,
        )

    def authenticate_user(self, user):
        """Helper method to authenticate a user"""
        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

    def test_search_content_with_query(self):
        """Test searching content with a query"""
        response = self.client.get(reverse("blog:search-content") + "?q=test")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("projects", response.data)
        self.assertIn("posts", response.data)
        self.assertIn("query", response.data)
        self.assertEqual(response.data["query"], "test")
        self.assertEqual(len(response.data["projects"]), 1)
        self.assertEqual(len(response.data["posts"]), 1)

    def test_search_content_without_query(self):
        """Test searching content without a query"""
        response = self.client.get(reverse("blog:search-content"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("message", response.data)
        self.assertEqual(response.data["projects"], [])
        self.assertEqual(response.data["posts"], [])

    def test_dashboard_stats_public(self):
        """Test public dashboard stats"""
        response = self.client.get(reverse("blog:dashboard-stats"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("total_users", response.data)
        self.assertIn("total_projects", response.data)
        self.assertIn("total_posts", response.data)
        self.assertEqual(response.data["total_projects"], 1)
        self.assertEqual(response.data["total_posts"], 1)

    def test_admin_stats_as_admin(self):
        """Test admin stats as admin user"""
        self.authenticate_user(self.admin)
        response = self.client.get(reverse("blog:admin-stats"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("users", response.data)
        self.assertIn("projects", response.data)
        self.assertIn("posts", response.data)

        # Check user stats structure
        self.assertIn("total", response.data["users"])
        self.assertIn("admins", response.data["users"])
        self.assertIn("members", response.data["users"])
        self.assertIn("viewers", response.data["users"])

    def test_admin_stats_as_member(self):
        """Test admin stats as member (should fail)"""
        self.authenticate_user(self.member)
        response = self.client.get(reverse("blog:admin-stats"))

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_stats_unauthenticated(self):
        """Test admin stats without authentication (should fail)"""
        response = self.client.get(reverse("blog:admin-stats"))

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class BlogSerializerTest(TestCase):
    """Test blog serializers"""

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123",
            first_name="Test",
            last_name="User",
        )

    def test_project_serializer_tech_stack_list(self):
        """Test ProjectSerializer tech_stack_list method"""
        from .serializers import ProjectSerializer

        project = Project.objects.create(
            owner=self.user,
            title="Test Project",
            description="Test description",
            tech_stack="Python, Django, React, JavaScript",
        )

        serializer = ProjectSerializer(project)
        tech_list = serializer.data["tech_stack_list"]

        expected_list = ["Python", "Django", "React", "JavaScript"]
        self.assertEqual(tech_list, expected_list)

    def test_project_serializer_empty_tech_stack(self):
        """Test ProjectSerializer with empty tech_stack"""
        from .serializers import ProjectSerializer

        project = Project.objects.create(
            owner=self.user,
            title="Test Project",
            description="Test description",
            tech_stack="",
        )

        serializer = ProjectSerializer(project)
        tech_list = serializer.data["tech_stack_list"]

        self.assertEqual(tech_list, [])

    def test_post_serializer_tags_list(self):
        """Test PostSerializer tags_list method"""
        from .serializers import PostSerializer

        post = Post.objects.create(
            author=self.user,
            title="Test Post",
            content="Test content",
            tags="python, django, testing, api",
        )

        serializer = PostSerializer(post)
        tags_list = serializer.data["tags_list"]

        expected_list = ["python", "django", "testing", "api"]
        self.assertEqual(tags_list, expected_list)

    def test_post_list_serializer_excerpt(self):
        """Test PostListSerializer excerpt method"""
        from .serializers import PostListSerializer

        long_content = (
            "This is a very long content " * 20
        )  # Make it longer than 200 chars
        post = Post.objects.create(
            author=self.user,
            title="Test Post",
            content=long_content,
            tags="testing",
        )

        serializer = PostListSerializer(post)
        excerpt = serializer.data["excerpt"]

        self.assertEqual(len(excerpt), 203)  # 200 chars + "..."
        self.assertTrue(excerpt.endswith("..."))

    def test_post_list_serializer_short_excerpt(self):
        """Test PostListSerializer excerpt with short content"""
        from .serializers import PostListSerializer

        short_content = "Short content"
        post = Post.objects.create(
            author=self.user,
            title="Test Post",
            content=short_content,
            tags="testing",
        )

        serializer = PostListSerializer(post)
        excerpt = serializer.data["excerpt"]

        self.assertEqual(excerpt, short_content)
        self.assertFalse(excerpt.endswith("..."))

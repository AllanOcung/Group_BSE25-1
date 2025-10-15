from django.test import TestCase
from django.contrib.auth import get_user_model
from blog.models import Post

User = get_user_model()


class PostModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="pass")

    def test_post_str(self):
        post = Post.objects.create(author=self.user, title="My Post", content="Test")
        self.assertEqual(str(post), "My Post")

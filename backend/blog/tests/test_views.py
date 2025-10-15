from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from blog.models import Post

User = get_user_model()


class PostViewsTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="pass")
        self.post = Post.objects.create(
            author=self.user, title="My Post", content="Test"
        )

    def test_list_posts(self):
        response = self.client.get(reverse("post-list"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "My Post")

    def test_detail_post(self):
        response = self.client.get(reverse("post-detail", args=[self.post.id]))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "My Post")

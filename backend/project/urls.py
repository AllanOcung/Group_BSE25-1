from typing import List, Union

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path
from django.urls.resolvers import URLPattern, URLResolver


def root_health_check(request):
    return JsonResponse({"status": "ok"})


def home(request):
    return JsonResponse({"message": "API is running"})


urlpatterns: List[Union[URLResolver, URLPattern]] = [
    path("", home),
    path("admin/", admin.site.urls),
    path("api/", include("users.urls")),
    path("api/blog/", include(("blog.urls", "blog"), namespace="blog")),
    path("health/", root_health_check, name="root-health-check"),
]

if settings.DEBUG:
    media_patterns = static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns = urlpatterns + list(media_patterns)

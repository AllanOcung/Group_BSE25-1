from typing import List, Union

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from django.urls.resolvers import URLPattern, URLResolver

urlpatterns: List[Union[URLResolver, URLPattern]] = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("users.urls")),
    path("api/blog/", include("blog.urls")),
    
]

if settings.DEBUG:
    media_patterns = static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns = urlpatterns + list(media_patterns)

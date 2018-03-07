from django.urls import include
from django.urls import path
from django.conf.urls.static import static
from rest_framework.documentation import include_docs_urls

from core import settings
from core import views

urlpatterns = []

if settings.DEBUG:
    urlpatterns += [
        path('docs/', include_docs_urls(title='User Service Data API',
                                        description='RESTful API for the User Service'))
    ]

urlpatterns += [
    path('', views.api_root),
    path('', include('users.urls'))
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
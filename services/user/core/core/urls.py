from django.urls import include
from django.urls import path
from rest_framework.documentation import include_docs_urls

from core import settings

urlpatterns = []

if settings.DEBUG:
    urlpatterns += [
        path(r'^docs/', include_docs_urls(title='User Service Data API',
                                          description='RESTful API for the User Service'))
    ]

urlpatterns += [
    path(r'^$', views.api_root),
    path(r'^'. include('data.urls', namespace='data'))
]

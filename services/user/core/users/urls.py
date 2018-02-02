from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from users import views

urlpatterns = [
    path(r'^users/$', views.UserList.as_view(), name='user-list')
    path(r'^users/<int:pk>', views.UserDetail.as_view(), name='user-detail')
]
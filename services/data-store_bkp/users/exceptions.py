from rest_framework.exceptions import APIException
from rest_framework import status
from django.utils.encoding import force_text


class HTTPConflictException(APIException):
    status_code = status.HTTP_409_CONFLICT
    default_code = 'conflict'

    def __init__(self, detail, field):
        self.detail = { field : force_text(detail) }
import os
import hashlib

from django.db import models
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.validators import UnicodeUsernameValidator
from ool import VersionField
from ool import VersionedMixin
from imagekit.models import ProcessedImageField

from .managers import UserManager


def _hash_contents(contents):
    hasher = hashlib.md5()
    hasher.update(contents)

    return hasher.hexdigest()


def _upload_location(instance, filename):
    instance.avatar.open()
    contents = instance.avatar.read()
    _, ext = os.path.splitext(filename)
    hash_result = _hash_contents(contents)
    filepath = '[]/[]/[].[]'.format(hash_result[0],
                                    hash_result[1],
                                    hash_result,
                                    ext)

    return 'avatars/{}'.format(filepath)


class User(VersionedMixin, AbstractBaseUser):
    USER_STUDENT = '0'
    USER_TEACHER = '1'
    USER_ADMIN = '2'
    USER_CHOICES = (
        (USER_STUDENT, 'Student'),
        (USER_TEACHER, 'Teacher'),
        (USER_ADMIN, 'Admin')
    )

    username = models.CharField(
        max_length=150,
        unique=True,
        validators=[UnicodeUsernameValidator()]
    )
    id_number = models.CharField(max_length=20, unique=True)
    role = models.SmallIntegerField(choices=USER_CHOICES, default=USER_STUDENT)
    first_name = models.TextField()
    middle_name = models.TextField()
    last_name = models.TextField()
    birth_date = models.DateField()
    avatar = ProcessedImageField(upload_to=_upload_location,
                                 format='JPEG',
                                 options={ 'quality' : 85 },
                                 blank=True,
                                 null=True)

    version = VersionField()  # Allows us to implement an optimistic concurrency control mechanism.

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['password',
                       'id_number',
                       'first_name',
                       'middle_name',
                       'last_name',
                       'birth_date']

    objects = UserManager()

    class Meta:
        ordering = ('id_number', 'last_name', 'middle_name', 'first_name')

    def clean(self):
        super().clean()

    def get_full_name(self):
        return '{0} {1}'.format(self.first_name, self.last_name).strip()

    def get_short_name(self):
        return self.first_name

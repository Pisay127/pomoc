from django.db import models
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.validators import UnicodeUsernameValidator
from ool import VersionField
from ool import VersionedMixin

from .managers import UserManager

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
    avatar = models.ImageField(upload_to='avatars')

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

    def _upload_location(instance, filename):
        
        return 'avatars/'

from django.db import models
from django.contrib.auth.base_user import AbstractBaseUser

from .managers import UserManager

class User(AbstractBaseUser):
    id_number = models.CharField(max_length=20, unique=True)
    role = models.SmallIntegerField()
    first_name = models.TextField()
    middle_name = models.TextField()
    last_name = models.TextField()
    birth_date = models.DateField()
    avatar = models.ImageField(upload_to='avatars')

    REQUIRED_FIELDS = []

    objects = UserManager()

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def get_full_name(self):
        return '{0} {1}'.format(self.first_name, self.last_name).strip()

    def get_short_name(self):
        return self.first_name

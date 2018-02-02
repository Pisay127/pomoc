from django.contrib.auth.base_user import BaseUserManager

class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, username, password, id_number, role, **extra_fields):
        if not username:
            raise ValueError('The username must be set.')

        username = self.model.normalize_username(username)
        user = self.model(username=username, id_number=id_number, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_student(self, username, password, id_number, **extra_fields):
        return self._create_user(username, password, id_number, 0, **extra_fields)

    def create_teacher(self, username, password, id_number, **extra_fields):
        return self._create_user(username, password, id_number, 1, **extra_fields)

    def create_admin(self, username, password, id_number, **extra_fields):
        return self._create_user(username, password, id_number, 2, **extra_fields)

# Generated by Django 2.0.1 on 2018-02-02 02:50

import django.contrib.auth.validators
from django.db import migrations, models
import users.managers


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('username', models.CharField(max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()])),
                ('id_number', models.CharField(max_length=20, unique=True)),
                ('role', models.SmallIntegerField()),
                ('first_name', models.TextField()),
                ('middle_name', models.TextField()),
                ('last_name', models.TextField()),
                ('birth_date', models.DateField()),
                ('avatar', models.ImageField(upload_to='avatars')),
            ],
            options={
                'ordering': ('id_number', 'last_name', 'middle_name', 'first_name'),
            },
            managers=[
                ('objects', users.managers.UserManager()),
            ],
        ),
    ]

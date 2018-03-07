import collections

from rest_framework import serializers
from ool import ConcurrentUpdate

from users.models import User
from users.exceptions import HTTPConflictException


class UserSerializer(serializers.HyperlinkedModelSerializer):
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        user = User(
            username=validated_data.get('username', None),
            id_number=validated_data.get('id_number', None),
            role=validated_data.get('role', 0),  # Default to student.
            first_name=validated_data.get('first_name', None),
            middle_name=validated_data.get('middle_name', None),
            last_name=validated_data.get('last_name', None),
            birth_date=validated_data.get('birth_date', None),
            avatar=validated_data.get('avatar', None)
        )
        user.set_password(validated_data.get('password', None))

        try:
            user.save()
        except ConcurrentUpdate as concurrent_exp:
            raise HTTPConflictException('Another request modified the resource you\'re modifying. Sadt.',
                                        'user')

        return user

    def update(self, instance, validated_data):
        for field in validated_data:
            if field == 'password':
                instance.set_password(validated_data.get(field))
            else:
                instance.__setattr__(field, validated_data.get(field))

        instance.save()
        return instance

    def to_representation(self, instance):
        ret = super(UserSerializer, self).to_representation(instance)
        return collections.OrderedDict(list(filter(lambda x: x[1], ret.items())))

    class Meta:
        model = User
        fields = ('url', 'id', 'username', 'password',
                  'id_number', 'role', 'first_name',
                  'middle_name', 'last_name', 'birth_date',
                  'avatar'
                 )
        extra_kwargs = {
            'url': {
                'view_name': 'users:user-detail',
            }
        }
from rest_framework import serializers

from .models import Agent


class AgentSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = Agent
        fields = [
            "id",
            "name",
            "brokerage",
            "phone",
            "bio",
            "is_verified",
        ]

    def get_name(self, obj):
        return obj.user.get_full_name() or obj.user.username

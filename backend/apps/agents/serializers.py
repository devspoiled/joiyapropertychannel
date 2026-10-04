from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from .models import Agent


class AgentSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    email = serializers.EmailField(source="user.email", read_only=True)
    listing_count = serializers.IntegerField(read_only=True, default=0)
    experience_highlights = serializers.SerializerMethodField()

    class Meta:
        model = Agent
        fields = [
            "id",
            "name",
            "email",
            "brokerage",
            "designation",
            "phone",
            "photo_url",
            "bio",
            "experience_highlights",
            "is_verified",
            "is_founder",
            "listing_count",
        ]

    def get_name(self, obj):
        return obj.user.get_full_name() or obj.user.username

    @extend_schema_field(serializers.ListField(child=serializers.CharField()))
    def get_experience_highlights(self, obj):
        return [line.strip() for line in obj.experience_highlights.splitlines() if line.strip()]

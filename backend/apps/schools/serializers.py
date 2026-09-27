from rest_framework import serializers

from .models import School


class SchoolSerializer(serializers.ModelSerializer):
    distance_km = serializers.SerializerMethodField()

    class Meta:
        model = School
        fields = ["id", "name", "type", "grade_levels", "city", "website", "distance_km"]

    def get_distance_km(self, obj):
        return getattr(obj, "distance_km", None)

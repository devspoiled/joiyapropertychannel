from rest_framework import serializers

from .models import Hospital


class HospitalSerializer(serializers.ModelSerializer):
    distance_km = serializers.SerializerMethodField()

    class Meta:
        model = Hospital
        fields = ["id", "name", "specialty", "contact", "website", "distance_km"]

    def get_distance_km(self, obj):
        return getattr(obj, "distance_km", None)

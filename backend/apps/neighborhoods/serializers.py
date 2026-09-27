from rest_framework import serializers

from .models import Neighborhood


class NeighborhoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Neighborhood
        fields = [
            "id",
            "name",
            "city",
            "slug",
            "description",
            "median_price_lac",
            "cover_image_url",
        ]

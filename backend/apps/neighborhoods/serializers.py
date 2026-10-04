from rest_framework import serializers

from .models import Neighborhood


class NeighborhoodSerializer(serializers.ModelSerializer):
    listing_count = serializers.IntegerField(read_only=True, default=0)

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
            "listing_count",
        ]

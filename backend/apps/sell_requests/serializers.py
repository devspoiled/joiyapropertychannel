from rest_framework import serializers

from .models import SellRequest


class SellRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellRequest
        fields = [
            "name",
            "email",
            "phone",
            "property_type",
            "address",
            "city",
            "demanding_price_lac",
            "latitude",
            "longitude",
        ]

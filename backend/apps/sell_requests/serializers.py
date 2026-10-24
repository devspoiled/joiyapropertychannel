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
            "area_value",
            "area_unit",
            "address",
            "city",
            "demanding_price_lac",
            "latitude",
            "longitude",
        ]

from rest_framework import serializers

from .models import TaxHistory


class TaxHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TaxHistory
        fields = ["id", "year", "tax_paid_lac", "assessed_value_lac"]

from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from apps.agents.serializers import AgentSerializer
from apps.neighborhoods.serializers import NeighborhoodSerializer
from apps.price_history.serializers import PriceHistorySerializer
from apps.tax_history.serializers import TaxHistorySerializer

from .models import Property, PropertyImage


class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ["id", "url", "order"]


class PropertyCardSerializer(serializers.ModelSerializer):
    """Lean shape for list views — only what a property card renders.
    Full nested images/tax_history/price_history are fetched separately
    on the detail page, not on every card in a listing grid. image_urls is
    just the URL strings (no id/order objects) so the card can carousel
    through photos on hover without the cost of the full images relation."""

    agent = AgentSerializer(read_only=True)
    neighborhood = NeighborhoodSerializer(read_only=True)
    image_urls = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = [
            "id",
            "agent",
            "neighborhood",
            "type",
            "status",
            "address",
            "price_lac",
            "latitude",
            "longitude",
            "plot_size",
            "beds",
            "baths",
            "sqft",
            "cover_image_url",
            "image_count",
            "image_urls",
        ]

    @extend_schema_field(serializers.ListField(child=serializers.CharField()))
    def get_image_urls(self, obj):
        return [img.url for img in obj.images.all()[:8]]


class PropertySerializer(serializers.ModelSerializer):
    agent = AgentSerializer(read_only=True)
    neighborhood = NeighborhoodSerializer(read_only=True)
    images = PropertyImageSerializer(many=True, read_only=True)
    tax_history = TaxHistorySerializer(many=True, read_only=True)
    price_history = PriceHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Property
        fields = [
            "id",
            "agent",
            "neighborhood",
            "type",
            "status",
            "address",
            "price_lac",
            "latitude",
            "longitude",
            "plot_size",
            "lot_size_sqft",
            "beds",
            "baths",
            "sqft",
            "year_built",
            "description",
            "cover_image_url",
            "image_count",
            "images",
            "tax_history",
            "price_history",
            "created_at",
        ]


class PropertyWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = [
            "agent",
            "neighborhood",
            "type",
            "status",
            "address",
            "price_lac",
            "latitude",
            "longitude",
            "plot_size",
            "lot_size_sqft",
            "beds",
            "baths",
            "sqft",
            "year_built",
            "description",
            "cover_image_url",
            "image_count",
            "is_active",
        ]

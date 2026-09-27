from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from .models import PriceHistory
from .serializers import PriceHistorySerializer


class PriceHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PriceHistorySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = PriceHistory.objects.select_related("property")
        property_id = self.request.query_params.get("property")
        if property_id:
            queryset = queryset.filter(property_id=property_id)
        return queryset

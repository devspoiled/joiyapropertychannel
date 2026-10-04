from django.db.models import Count, Q
from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from .models import Neighborhood
from .serializers import NeighborhoodSerializer


class NeighborhoodViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Neighborhood.objects.annotate(
        listing_count=Count("properties", filter=Q(properties__is_active=True), distinct=True)
    )
    serializer_class = NeighborhoodSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        city = self.request.query_params.get("city")
        if city:
            queryset = queryset.filter(city__iexact=city)
        return queryset

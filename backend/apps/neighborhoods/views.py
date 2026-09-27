from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from .models import Neighborhood
from .serializers import NeighborhoodSerializer


class NeighborhoodViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Neighborhood.objects.all()
    serializer_class = NeighborhoodSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        city = self.request.query_params.get("city")
        if city:
            queryset = queryset.filter(city__iexact=city)
        return queryset

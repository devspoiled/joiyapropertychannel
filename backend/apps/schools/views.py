from drf_spectacular.utils import OpenApiParameter, extend_schema, extend_schema_view
from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from apps.api.geo import sort_by_distance

from .models import School
from .serializers import SchoolSerializer


@extend_schema_view(
    list=extend_schema(
        parameters=[
            OpenApiParameter(
                "lat", float, description="Latitude to sort schools nearest-first from."
            ),
            OpenApiParameter(
                "lng", float, description="Longitude to sort schools nearest-first from."
            ),
            OpenApiParameter(
                "limit", int, description="Max number of schools to return (nearest first)."
            ),
        ]
    )
)
class SchoolViewSet(viewsets.ReadOnlyModelViewSet):
    """Read-only schools list. Pass ?lat=&lng= to get distance_km from a
    point and have results sorted nearest-first (used for a property's
    "Nearby schools" section)."""

    queryset = School.objects.all()
    serializer_class = SchoolSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        lat = self.request.query_params.get("lat")
        lng = self.request.query_params.get("lng")
        if lat is None or lng is None:
            return queryset
        return sort_by_distance(queryset, lat, lng, self.request.query_params.get("limit"))

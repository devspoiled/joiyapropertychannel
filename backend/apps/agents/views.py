from django.db.models import Count, Q
from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from .models import Agent
from .serializers import AgentSerializer


class AgentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = (
        Agent.objects.select_related("user")
        .filter(is_verified=True)
        .annotate(
            listing_count=Count("properties", filter=Q(properties__is_active=True), distinct=True)
        )
    )
    serializer_class = AgentSerializer
    permission_classes = [AllowAny]

from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from .models import Agent
from .serializers import AgentSerializer


class AgentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Agent.objects.select_related("user").filter(is_verified=True)
    serializer_class = AgentSerializer
    permission_classes = [AllowAny]

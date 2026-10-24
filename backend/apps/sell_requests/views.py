import logging

from django.conf import settings
from rest_framework import generics
from rest_framework.permissions import AllowAny

from apps.api.resend_email import send_sell_request_email

from .models import SellRequest
from .serializers import SellRequestSerializer

logger = logging.getLogger(__name__)


class SellRequestCreateView(generics.CreateAPIView):
    """Public 'Sell your home' lead form — always saved to the database so
    staff can review it in the admin, regardless of whether the best-effort
    email notification below is configured or succeeds."""

    queryset = SellRequest.objects.all()
    serializer_class = SellRequestSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        sell_request = serializer.save()
        if settings.RESEND_API_KEY:
            try:
                send_sell_request_email(sell_request)
            except Exception:
                logger.exception("Failed to send sell request notification email")

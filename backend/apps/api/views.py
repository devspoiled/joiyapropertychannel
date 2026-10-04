from django.conf import settings
from drf_spectacular.utils import extend_schema
from rest_framework import serializers, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .resend_email import send_contact_email


class ContactSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=30, required=False, allow_blank=True)
    message = serializers.CharField()


class ContactView(APIView):
    """Site-wide 'Contact us' form — always delivers to CONTACT_EMAIL_TO,
    regardless of who's asking, so it isn't configurable per-request."""

    permission_classes = [AllowAny]

    @extend_schema(request=ContactSerializer, responses={204: None, 503: None})
    def post(self, request, *args, **kwargs):
        if not settings.RESEND_API_KEY:
            return Response(
                {"detail": "Contact form is not configured yet."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        serializer = ContactSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        send_contact_email(**serializer.validated_data)

        return Response(status=status.HTTP_204_NO_CONTENT)

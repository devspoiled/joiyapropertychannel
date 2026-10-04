import json
import urllib.request
from urllib.error import HTTPError

from django.conf import settings

RESEND_API_URL = "https://api.resend.com/emails"


def send_contact_email(name: str, email: str, phone: str, message: str) -> None:
    payload = {
        "from": settings.CONTACT_EMAIL_FROM,
        "to": [settings.CONTACT_EMAIL_TO],
        "reply_to": email,
        "subject": f"New contact form message from {name}",
        "text": f"Name: {name}\nEmail: {email}\nPhone: {phone or '-'}\n\n{message}",
    }
    request = urllib.request.Request(
        RESEND_API_URL,
        data=json.dumps(payload).encode(),
        headers={
            "Authorization": f"Bearer {settings.RESEND_API_KEY}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        urllib.request.urlopen(request, timeout=10)  # noqa: S310
    except HTTPError as e:
        raise RuntimeError(f"Resend rejected the email: {e.code} {e.read().decode()}") from e

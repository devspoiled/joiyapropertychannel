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


def send_sell_request_email(sell_request) -> None:
    """Best-effort notification that a new sell request came in — the
    submission is already saved to the database regardless of whether this
    succeeds, so a failure here is logged, not raised, by the caller."""
    r = sell_request
    text = (
        f"Name: {r.name}\nEmail: {r.email}\nPhone: {r.phone}\n\n"
        f"Property type: {r.get_property_type_display()}\n"
        f"Address: {r.address}\nCity: {r.city}\n"
        f"Demanding price: Rs {r.demanding_price_lac} Lac\n"
        f"Location: {r.latitude}, {r.longitude}\n"
    )
    payload = {
        "from": settings.CONTACT_EMAIL_FROM,
        "to": [settings.CONTACT_EMAIL_TO],
        "reply_to": r.email,
        "subject": f"New sell request from {r.name}",
        "text": text,
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

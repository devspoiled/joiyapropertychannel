from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.properties.models import Property


class SellRequest(models.Model):
    class ReviewStatus(models.TextChoices):
        NEW = "new", _("New")
        CONTACTED = "contacted", _("Contacted")
        CLOSED = "closed", _("Closed")

    # Submitter's contact details — not necessarily a registered user.
    name = models.CharField(_("name"), max_length=150)
    email = models.EmailField(_("email"))
    phone = models.CharField(_("phone"), max_length=30)

    property_type = models.CharField(
        _("property type"), max_length=20, choices=Property.PropertyType.choices
    )
    address = models.CharField(_("address"), max_length=255)
    city = models.CharField(_("city"), max_length=120)
    demanding_price_lac = models.PositiveIntegerField(_("demanding price (lac PKR)"))
    latitude = models.DecimalField(
        _("latitude"), max_digits=9, decimal_places=6, null=True, blank=True
    )
    longitude = models.DecimalField(
        _("longitude"), max_digits=9, decimal_places=6, null=True, blank=True
    )

    review_status = models.CharField(
        _("review status"),
        max_length=20,
        choices=ReviewStatus.choices,
        default=ReviewStatus.NEW,
    )
    created_at = models.DateTimeField(_("submitted at"), auto_now_add=True)

    class Meta:
        db_table = "sell_requests"
        verbose_name = _("sell request")
        verbose_name_plural = _("sell requests")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} — {self.address}"

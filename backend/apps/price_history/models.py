from django.db import models
from django.utils.translation import gettext_lazy as _


class PriceHistory(models.Model):
    class EventType(models.TextChoices):
        LISTED = "listed", _("Listed")
        PRICE_CHANGE = "price_change", _("Price change")
        SOLD = "sold", _("Sold")
        PENDING = "pending", _("Pending")

    property = models.ForeignKey(
        "properties.Property",
        on_delete=models.CASCADE,
        related_name="price_history",
        verbose_name=_("property"),
    )
    event = models.CharField(_("event"), max_length=20, choices=EventType.choices)
    price_lac = models.PositiveIntegerField(_("price (lac PKR)"))
    date = models.DateField(_("date"))

    class Meta:
        db_table = "price_history"
        verbose_name = _("price history entry")
        verbose_name_plural = _("price history")
        ordering = ["-date"]

    def __str__(self):
        return f"{self.property.address} — {self.event} on {self.date}"

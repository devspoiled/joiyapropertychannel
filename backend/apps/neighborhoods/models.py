from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.api.models import UUIDModel


class Neighborhood(UUIDModel):
    name = models.CharField(_("name"), max_length=120)
    city = models.CharField(_("city"), max_length=120)
    slug = models.SlugField(_("slug"), max_length=140, unique=True)
    description = models.TextField(_("description"), blank=True)
    median_price_lac = models.PositiveIntegerField(
        _("median price (lac PKR)"), null=True, blank=True
    )
    cover_image_url = models.URLField(_("cover image URL"), blank=True)
    created_at = models.DateTimeField(_("created at"), auto_now_add=True)
    modified_at = models.DateTimeField(_("modified at"), auto_now=True)

    class Meta:
        db_table = "neighborhoods"
        verbose_name = _("neighborhood")
        verbose_name_plural = _("neighborhoods")
        ordering = ["city", "name"]
        constraints = [
            models.UniqueConstraint(
                fields=["name", "city"], name="unique_neighborhood_per_city"
            )
        ]

    def __str__(self):
        return f"{self.name}, {self.city}"

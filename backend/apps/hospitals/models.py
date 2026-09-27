from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.api.models import UUIDModel


class Hospital(UUIDModel):
    name = models.CharField(_("name"), max_length=200)
    specialty = models.CharField(_("specialty"), max_length=150, blank=True)
    contact = models.CharField(_("contact"), max_length=30, blank=True)
    website = models.URLField(_("website"), blank=True)
    latitude = models.DecimalField(_("latitude"), max_digits=9, decimal_places=6)
    longitude = models.DecimalField(_("longitude"), max_digits=9, decimal_places=6)

    class Meta:
        db_table = "hospitals"
        verbose_name = _("hospital")
        verbose_name_plural = _("hospitals")
        ordering = ["name"]

    def __str__(self):
        return self.name

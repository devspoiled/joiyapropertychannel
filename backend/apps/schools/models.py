from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.api.models import UUIDModel


class School(UUIDModel):
    class SchoolType(models.TextChoices):
        PRIMARY = "primary", _("Primary")
        SECONDARY = "secondary", _("Secondary")
        HIGH = "high", _("High school")
        COLLEGE = "college", _("College")

    name = models.CharField(_("name"), max_length=200)
    type = models.CharField(_("type"), max_length=20, choices=SchoolType.choices)
    grade_levels = models.CharField(_("grade levels"), max_length=60, blank=True)
    city = models.CharField(_("city"), max_length=120)
    website = models.URLField(_("website"), blank=True)
    latitude = models.DecimalField(_("latitude"), max_digits=9, decimal_places=6)
    longitude = models.DecimalField(_("longitude"), max_digits=9, decimal_places=6)

    class Meta:
        db_table = "schools"
        verbose_name = _("school")
        verbose_name_plural = _("schools")
        ordering = ["name"]

    def __str__(self):
        return self.name

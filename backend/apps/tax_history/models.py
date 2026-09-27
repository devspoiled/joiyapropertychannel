from django.db import models
from django.utils.translation import gettext_lazy as _


class TaxHistory(models.Model):
    property = models.ForeignKey(
        "properties.Property",
        on_delete=models.CASCADE,
        related_name="tax_history",
        verbose_name=_("property"),
    )
    year = models.PositiveIntegerField(_("year"))
    tax_paid_lac = models.DecimalField(
        _("tax paid (lac PKR)"), max_digits=10, decimal_places=2
    )
    assessed_value_lac = models.PositiveIntegerField(
        _("assessed value (lac PKR)"), null=True, blank=True
    )

    class Meta:
        db_table = "tax_history"
        verbose_name = _("tax history entry")
        verbose_name_plural = _("tax history")
        ordering = ["-year"]
        constraints = [
            models.UniqueConstraint(
                fields=["property", "year"], name="unique_tax_year_per_property"
            )
        ]

    def __str__(self):
        return f"{self.property.address} — {self.year} tax"

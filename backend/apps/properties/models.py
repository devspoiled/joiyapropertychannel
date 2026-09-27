from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.api.models import UUIDModel


class Property(UUIDModel):
    class PropertyType(models.TextChoices):
        PLOT = "plot", _("Plot")
        HOUSE = "house", _("House")
        APARTMENT = "apartment", _("Apartment")
        VILLA = "villa", _("Villa")

    class ListingStatus(models.TextChoices):
        NEW = "new", _("New")
        OPEN_HOUSE = "open_house", _("Open house")
        PRICE_DROP = "price_drop", _("Price drop")
        FOR_SALE = "for_sale", _("For sale")
        SOLD = "sold", _("Sold")

    agent = models.ForeignKey(
        "agents.Agent",
        on_delete=models.PROTECT,
        related_name="properties",
        verbose_name=_("agent"),
    )
    neighborhood = models.ForeignKey(
        "neighborhoods.Neighborhood",
        on_delete=models.PROTECT,
        related_name="properties",
        verbose_name=_("neighborhood"),
    )
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="saved_properties",
        verbose_name=_("saved by"),
        null=True,
        blank=True,
        help_text=_("Customer this listing is saved/favourited by, if any."),
    )

    type = models.CharField(
        _("property type"), max_length=20, choices=PropertyType.choices
    )
    status = models.CharField(
        _("listing status"),
        max_length=20,
        choices=ListingStatus.choices,
        default=ListingStatus.FOR_SALE,
    )

    address = models.CharField(_("address"), max_length=255)
    price_lac = models.PositiveIntegerField(_("price (lac PKR)"))
    latitude = models.DecimalField(
        _("latitude"), max_digits=9, decimal_places=6, null=True, blank=True
    )
    longitude = models.DecimalField(
        _("longitude"), max_digits=9, decimal_places=6, null=True, blank=True
    )

    # Plot-specific sizing, e.g. "10 Marla", "1 Kanal".
    plot_size = models.CharField(_("plot size"), max_length=60, blank=True)
    lot_size_sqft = models.PositiveIntegerField(
        _("lot size (sq ft)"), null=True, blank=True
    )

    # Constructed-property specifics; left null for bare plots.
    beds = models.PositiveSmallIntegerField(_("beds"), null=True, blank=True)
    baths = models.PositiveSmallIntegerField(_("baths"), null=True, blank=True)
    sqft = models.PositiveIntegerField(_("covered area (sq ft)"), null=True, blank=True)
    year_built = models.PositiveSmallIntegerField(_("year built"), null=True, blank=True)

    description = models.TextField(_("description"), blank=True)
    cover_image_url = models.URLField(_("cover image URL"), blank=True)
    image_count = models.PositiveIntegerField(_("image count"), default=0)

    is_active = models.BooleanField(_("active"), default=True)
    created_at = models.DateTimeField(_("created at"), auto_now_add=True)
    modified_at = models.DateTimeField(_("modified at"), auto_now=True)

    class Meta:
        db_table = "properties"
        verbose_name = _("property")
        verbose_name_plural = _("properties")
        ordering = ["-created_at"]

    def __str__(self):
        return self.address


class PropertyImage(models.Model):
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name="images",
        verbose_name=_("property"),
    )
    url = models.URLField(_("image URL"))
    order = models.PositiveIntegerField(_("order"), default=0)

    class Meta:
        db_table = "property_images"
        verbose_name = _("property image")
        verbose_name_plural = _("property images")
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.property.address} — photo {self.order + 1}"

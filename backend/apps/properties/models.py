from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.api.models import UUIDModel


class PropertyFeature(models.Model):
    """A fixed taxonomy of selectable amenities/features (heating, cooling,
    parking, etc.) — grouped by category, same idea as Zillow's "Facts and
    features" section. The actual rows are seeded by a migration (so they
    exist in prod too, which never runs the demo `seed` command), not
    created ad hoc by staff."""

    class Category(models.TextChoices):
        INTERIOR = "interior", _("Interior Features")
        HEATING = "heating", _("Heating")
        COOLING = "cooling", _("Cooling")
        APPLIANCES = "appliances", _("Appliances")
        PARKING = "parking", _("Parking")
        EXTERIOR = "exterior", _("Exterior Features")
        SECURITY = "security", _("Security Features")
        UTILITIES = "utilities", _("Utilities")
        COMMUNITY = "community", _("Community Features")

    name = models.CharField(_("name"), max_length=100)
    category = models.CharField(_("category"), max_length=20, choices=Category.choices)

    class Meta:
        db_table = "property_features"
        verbose_name = _("property feature")
        verbose_name_plural = _("property features")
        ordering = ["category", "name"]
        constraints = [
            models.UniqueConstraint(fields=["name", "category"], name="unique_feature_per_category")
        ]

    def __str__(self):
        return self.name


class Property(UUIDModel):
    class PropertyType(models.TextChoices):
        PLOT = "plot", _("Plot")
        HOUSE = "house", _("House")
        APARTMENT = "apartment", _("Apartment")
        VILLA = "villa", _("Villa")
        FARM_HOUSE = "farm_house", _("Farm House")

    class ListingStatus(models.TextChoices):
        NEW = "new", _("New")
        OPEN_HOUSE = "open_house", _("Open house")
        PRICE_DROP = "price_drop", _("Price drop")
        FOR_SALE = "for_sale", _("For sale")
        FOR_RENT = "for_rent", _("For rent")
        SOLD = "sold", _("Sold")

    agent = models.ForeignKey(
        "agents.Agent",
        on_delete=models.CASCADE,
        related_name="properties",
        verbose_name=_("agent"),
    )
    neighborhood = models.ForeignKey(
        "neighborhoods.Neighborhood",
        on_delete=models.CASCADE,
        related_name="properties",
        verbose_name=_("neighborhood"),
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

    # Pakistani housing societies are organized into named/lettered blocks
    # (e.g. "C", "Chenab Block"), and a property is identified within one by
    # a single number — e.g. "Plot 3, Block C" or "House 238, Block D".
    # One column regardless of type; the admin UI just labels/shows it as
    # "House number", "Plot number" etc. based on the selected `type`.
    block = models.CharField(_("block"), max_length=60, blank=True)
    property_number = models.CharField(_("property number"), max_length=30, blank=True)

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

    features = models.ManyToManyField(
        PropertyFeature, blank=True, related_name="properties", verbose_name=_("features")
    )

    # Explicitly curated by staff — shown in preference to the automatic
    # distance-based "nearby" lookup when set (a property can have more
    # than one of each).
    nearby_schools = models.ManyToManyField(
        "schools.School", blank=True, related_name="nearby_in_properties", verbose_name=_("nearby schools")
    )
    nearby_hospitals = models.ManyToManyField(
        "hospitals.Hospital", blank=True, related_name="nearby_in_properties", verbose_name=_("nearby hospitals")
    )

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


class SavedProperty(models.Model):
    """Join table for a customer favouriting/saving a listing — a property
    can be saved by many customers, and a customer can save many properties."""

    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name="saves",
        verbose_name=_("property"),
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="saved_properties",
        verbose_name=_("user"),
    )
    created_at = models.DateTimeField(_("created at"), auto_now_add=True)

    class Meta:
        db_table = "saved_properties"
        verbose_name = _("saved property")
        verbose_name_plural = _("saved properties")
        constraints = [
            models.UniqueConstraint(
                fields=["property", "user"], name="unique_saved_property_per_user"
            )
        ]

    def __str__(self):
        return f"{self.user} saved {self.property.address}"

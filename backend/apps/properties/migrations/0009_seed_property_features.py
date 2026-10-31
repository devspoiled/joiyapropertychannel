from django.db import migrations

FEATURES = {
    "interior": [
        "Walk-in Closet(s)",
        "Ceiling Fan(s)",
        "False Ceiling",
        "Store Room",
        "Drawing Room",
        "Study Room",
        "Servant Quarter",
        "Powder Room",
    ],
    "heating": [
        "Central Heating",
        "Gas Heater",
        "Electric Heater",
    ],
    "cooling": [
        "Central Air Conditioning",
        "Split AC Units",
        "Window AC Units",
        "Evaporative Cooler",
    ],
    "appliances": [
        "Refrigerator",
        "Microwave Oven",
        "Dishwasher",
        "Washing Machine",
        "Electric Water Heater (Geyser)",
        "Built-in Oven",
        "Cooking Range",
    ],
    "parking": [
        "Garage",
        "Carport",
        "Covered Parking",
        "Driveway Parking",
        "Off-Street Parking",
    ],
    "exterior": [
        "Balcony",
        "Terrace",
        "Front Lawn",
        "Back Garden",
        "Swimming Pool",
        "BBQ / Outdoor Seating Area",
        "Boundary Wall",
    ],
    "security": [
        "Gated Community",
        "CCTV Cameras",
        "Security Guard",
        "Intercom System",
        "Video Entry System",
    ],
    "utilities": [
        "Backup Generator",
        "UPS / Electricity Backup",
        "Solar Panels",
        "Water Boring",
        "Water Tank / Storage",
        "Sui Gas Connection",
    ],
    "community": [
        "Nearby Mosque",
        "Nearby School",
        "Nearby Park",
        "Nearby Hospital",
        "Clubhouse / Community Center",
        "Gym / Fitness Center",
    ],
}


def seed_features(apps, schema_editor):
    PropertyFeature = apps.get_model("properties", "PropertyFeature")
    PropertyFeature.objects.bulk_create(
        [
            PropertyFeature(name=name, category=category)
            for category, names in FEATURES.items()
            for name in names
        ],
        ignore_conflicts=True,
    )


def remove_features(apps, schema_editor):
    PropertyFeature = apps.get_model("properties", "PropertyFeature")
    all_names = [name for names in FEATURES.values() for name in names]
    PropertyFeature.objects.filter(name__in=all_names).delete()


class Migration(migrations.Migration):
    dependencies = [
        ("properties", "0008_propertyfeature_property_features"),
    ]

    operations = [
        migrations.RunPython(seed_features, remove_features),
    ]

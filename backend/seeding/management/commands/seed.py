import random
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.agents.models import Agent
from apps.hospitals.models import Hospital
from apps.neighborhoods.models import Neighborhood
from apps.price_history.models import PriceHistory
from apps.properties.models import Property, PropertyImage
from apps.schools.models import School
from apps.tax_history.models import TaxHistory

User = get_user_model()

# Real, well-known Lahore schools with approximate real coordinates and, where
# publicly known, their real website — used for each property's "Nearby
# schools" section. No fabricated ratings.
SCHOOLS = [
    ("Lahore Grammar School, Defence", School.SchoolType.SECONDARY, "1-10", 31.4726, 74.4076, "https://www.lgs.edu.pk"),
    ("Beaconhouse DHA Campus", School.SchoolType.HIGH, "K-12", 31.4658, 74.4188, "https://www.beaconhouse.net"),
    ("Aitchison College", School.SchoolType.HIGH, "1-12", 31.5459, 74.3212, "https://www.aitchison.edu.pk"),
    ("Lahore American School", School.SchoolType.HIGH, "PK-12", 31.4739, 74.3901, "https://www.las.edu.pk"),
    ("The City School, Gulberg", School.SchoolType.SECONDARY, "1-10", 31.5108, 74.3489, "https://www.thecityschool.edu.pk"),
    ("LACAS Model Town", School.SchoolType.HIGH, "1-12", 31.4821, 74.3251, "https://www.lacas.edu.pk"),
    ("Roots Millennium, Bahria Town", School.SchoolType.SECONDARY, "1-10", 31.3701, 74.1852, "https://www.rootssmc.com"),
    ("Beaconhouse Bahria Town", School.SchoolType.PRIMARY, "PK-5", 31.3672, 74.1789, "https://www.beaconhouse.net"),
    ("Divisional Public School, DHA", School.SchoolType.PRIMARY, "PK-5", 31.4415, 74.3841, ""),
]

# Real, well-known Lahore hospitals with approximate real coordinates and
# real websites where publicly known — used for each property's "Nearby
# hospitals" section.
HOSPITALS = [
    ("Shaukat Khanum Memorial Cancer Hospital", "Oncology", "+92-42-35945000", 31.4711, 74.4088, "https://shaukatkhanum.org.pk"),
    ("Doctors Hospital", "Multispecialty", "+92-42-111-678-679", 31.4762, 74.3862, "https://doctorshospital.com.pk"),
    ("Hameed Latif Hospital", "Multispecialty", "+92-42-111-000-043", 31.5138, 74.3299, "https://hameedlatifhospital.com"),
    ("Services Hospital", "General / Emergency", "+92-42-99200518", 31.5535, 74.3234, ""),
    ("Sheikh Zayed Hospital", "Multispecialty", "+92-42-35880045", 31.4906, 74.3125, ""),
    ("National Hospital, Bahria Town", "General / Emergency", "+92-42-37180400", 31.3659, 74.1834, ""),
]


NEIGHBORHOODS = [
    # name, city, median_price_lac, photo_id, center_lat, center_lng
    ("DHA Phase 6", "Lahore", 640, "photo-1600585154340-be6161a56a0c", 31.4697, 74.4142),
    ("DHA Phase 9", "Lahore", 190, "photo-1494526585095-c41746248156", 31.4432, 74.3805),
    ("Gulberg III", "Lahore", 310, "photo-1449824913935-59a10b8d2000", 31.5099, 74.3466),
    ("Bahria Town", "Lahore", 85, "photo-1570129477492-45c003edd2be", 31.3688, 74.1817),
    ("Model Town", "Lahore", 420, "photo-1512917774080-9991f1c4c750", 31.4805, 74.3235),
]

AGENTS = [
    ("ayesha.tariq", "Ayesha", "Tariq", "Joiya Verified"),
    ("bilal.sheikh", "Bilal", "Sheikh", "Meridian Estates"),
    ("hina.qureshi", "Hina", "Qureshi", "Joiya Verified"),
    ("usman.raza", "Usman", "Raza", "Crestline Realty"),
]

STREETS = [
    "Street 12", "Block D", "Sector C", "Mini Market", "Cavalry Ground",
    "Zaman Park", "Faisal Town", "Township Sector",
]

# Real, freely-licensed Unsplash photos of houses, plots, and interiors —
# used as cover_image_url / gallery images so seeded listings render actual
# photography. Each pool has enough variety to give a property 4-6 distinct
# photos without heavy repetition.
PLOT_PHOTOS = [
    "photo-1500382017468-9049fed747ef",
    "photo-1500937386664-56d1dfef3854",
    "photo-1501183638710-841dd1904471",
    "photo-1444858291040-58f756a3bdd6",
    "photo-1500534623283-312aade485b7",
    "photo-1500382017468-9049fed747ef",
    "photo-1464082354059-27db6ce50048",
    "photo-1500375592092-40eb2168fd21",
]
HOUSE_PHOTOS = [
    "photo-1568605114967-8130f3a36994",
    "photo-1613977257363-707ba9348227",
    "photo-1600596542815-ffad4c1539a9",
    "photo-1600607687939-ce8a6c25118c",
    "photo-1600585154526-990dced4db0d",
    "photo-1600047509807-ba8f99d2cdde",
    "photo-1600566753086-00f18fb6b3ea",
    "photo-1600210492493-0946911123ea",
]
APARTMENT_PHOTOS = [
    "photo-1502672260266-1c1ef2d93688",
    "photo-1522708323590-d24dbb6b0267",
    "photo-1512918728675-ed5a9ecdebfd",
    "photo-1493809842364-78817add7ffb",
    "photo-1560448204-e02f11c3d0e2",
    "photo-1554995207-c18c203602cb",
]
VILLA_PHOTOS = [
    "photo-1613490493576-7fde63acd811",
    "photo-1600566753190-17f0baa2a6c3",
    "photo-1580587771525-78b9dba3b914",
    "photo-1600585152220-90363fe7e115",
    "photo-1571055107559-3e67626fa8be",
    "photo-1613977257592-4871e5fcaf91",
]

PHOTO_BY_TYPE = {
    Property.PropertyType.PLOT: PLOT_PHOTOS,
    Property.PropertyType.HOUSE: HOUSE_PHOTOS,
    Property.PropertyType.APARTMENT: APARTMENT_PHOTOS,
    Property.PropertyType.VILLA: VILLA_PHOTOS,
}


def unsplash_url(photo_id, width=1200, height=800):
    return f"https://images.unsplash.com/{photo_id}?w={width}&h={height}&fit=crop&auto=format"


class Command(BaseCommand):
    help = "Seed demo neighborhoods, agents, properties, and an admin user."

    def add_arguments(self, parser):
        parser.add_argument(
            "--count",
            type=int,
            default=60,
            help="Number of demo properties to create (default: 60).",
        )

    def handle(self, *args, **options):
        admin_user, admin_created = User.objects.get_or_create(
            username="admin",
            defaults={
                "email": "admin@joiya.test",
                "is_staff": True,
                "is_superuser": True,
                "is_active": True,
            },
        )
        if admin_created:
            admin_user.set_password("admin12345")
            admin_user.save(update_fields=["password"])

        neighborhoods = []
        neighborhood_centers = {}
        for name, city, median, photo_id, lat, lng in NEIGHBORHOODS:
            obj, _ = Neighborhood.objects.get_or_create(
                name=name,
                city=city,
                defaults={
                    "slug": name.lower().replace(" ", "-"),
                    "median_price_lac": median,
                    "cover_image_url": unsplash_url(photo_id),
                },
            )
            neighborhoods.append(obj)
            neighborhood_centers[obj.id] = (lat, lng)

        for name, school_type, grades, lat, lng, website in SCHOOLS:
            School.objects.get_or_create(
                name=name,
                defaults={
                    "type": school_type,
                    "grade_levels": grades,
                    "city": "Lahore",
                    "website": website,
                    "latitude": lat,
                    "longitude": lng,
                },
            )

        for name, specialty, contact, lat, lng, website in HOSPITALS:
            Hospital.objects.get_or_create(
                name=name,
                defaults={
                    "specialty": specialty,
                    "contact": contact,
                    "website": website,
                    "latitude": lat,
                    "longitude": lng,
                },
            )

        agents = []
        for username, first, last, brokerage in AGENTS:
            user, _ = User.objects.get_or_create(
                username=username,
                defaults={
                    "first_name": first,
                    "last_name": last,
                    "email": f"{username}@joiya.test",
                    "role": User.Role.AGENT,
                    "is_active": True,
                },
            )
            agent, _ = Agent.objects.get_or_create(
                user=user,
                defaults={"brokerage": brokerage, "is_verified": True},
            )
            agents.append(agent)

        types = [c[0] for c in Property.PropertyType.choices]
        statuses = [c[0] for c in Property.ListingStatus.choices]
        now = timezone.now()
        count = options["count"]

        created = 0
        for _i in range(count):
            neighborhood = random.choice(neighborhoods)
            agent = random.choice(agents)
            prop_type = random.choices(types, weights=[45, 30, 15, 10], k=1)[0]
            is_plot = prop_type == Property.PropertyType.PLOT
            price_lac = random.randint(60, 900)
            center_lat, center_lng = neighborhood_centers[neighborhood.id]
            # Small jitter (~within a couple km) so properties in the same
            # neighborhood don't all stack on one map point.
            jitter = lambda: random.uniform(-0.008, 0.008)  # noqa: E731

            property_obj = Property.objects.create(
                agent=agent,
                neighborhood=neighborhood,
                type=prop_type,
                status=random.choice(statuses),
                address=f"{random.choice(STREETS)}, {neighborhood.name}",
                price_lac=price_lac,
                latitude=round(center_lat + jitter(), 6),
                longitude=round(center_lng + jitter(), 6),
                plot_size=(
                    random.choice(["5 Marla", "10 Marla", "1 Kanal", "2 Kanal"])
                    if is_plot
                    else random.choice(["Penthouse", "2 Kanal", "1 Kanal"])
                ),
                lot_size_sqft=random.randint(2500, 12000),
                beds=None if is_plot else random.randint(2, 6),
                baths=None if is_plot else random.randint(2, 5),
                sqft=None if is_plot else random.randint(1200, 4500),
                year_built=None if is_plot else random.randint(1985, 2024),
                cover_image_url=unsplash_url(random.choice(PHOTO_BY_TYPE[prop_type])),
                image_count=random.randint(8, 55),
            )
            # auto_now_add ignores assignment through .save(); update via queryset instead.
            listed_days_ago = random.randint(0, 29)
            Property.objects.filter(pk=property_obj.pk).update(
                created_at=now - timedelta(days=listed_days_ago)
            )

            # Gallery: 4-6 distinct real photos from this property type's pool.
            gallery = random.sample(
                PHOTO_BY_TYPE[prop_type], k=min(random.randint(4, 6), len(PHOTO_BY_TYPE[prop_type]))
            )
            PropertyImage.objects.bulk_create(
                [
                    PropertyImage(property=property_obj, url=unsplash_url(photo_id), order=i)
                    for i, photo_id in enumerate(gallery)
                ]
            )

            # Price history: listed at an initial price, optionally a later price
            # change, ending at the property's current price_lac.
            listed_date = (now - timedelta(days=listed_days_ago)).date()
            initial_price = max(10, round(price_lac * random.uniform(0.92, 1.08)))
            PriceHistory.objects.create(
                property=property_obj,
                event=PriceHistory.EventType.LISTED,
                price_lac=initial_price,
                date=listed_date,
            )
            if initial_price != price_lac and random.random() > 0.4:
                PriceHistory.objects.create(
                    property=property_obj,
                    event=PriceHistory.EventType.PRICE_CHANGE,
                    price_lac=price_lac,
                    date=listed_date + timedelta(days=random.randint(1, max(listed_days_ago, 1))),
                )

            # Tax history: last 3-5 years, assessed value roughly tracking price.
            current_year = timezone.now().year
            for years_back in range(random.randint(3, 5)):
                year = current_year - years_back
                assessed = round(price_lac * random.uniform(0.55, 0.75))
                TaxHistory.objects.create(
                    property=property_obj,
                    year=year,
                    tax_paid_lac=round(assessed * 0.01, 2),
                    assessed_value_lac=assessed,
                )

            created += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Seeded {len(neighborhoods)} neighborhoods, {len(agents)} agents, "
                f"{created} properties with photo galleries, price history, and tax history."
            )
        )
        if admin_created:
            self.stdout.write(
                self.style.WARNING(
                    "Admin user created — username: admin, password: admin12345 "
                    "(change this before deploying anywhere real)."
                )
            )
        else:
            self.stdout.write("Admin user already existed — left password unchanged.")

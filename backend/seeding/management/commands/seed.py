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
from seeding import cloudinary_images

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
    # name, city, median_price_lac, photo_entry, center_lat, center_lng, forced_type
    # forced_type pins every property in that scheme to one listing type, so
    # the address format below (plot/house numbering) always matches what's
    # actually being sold there — these three are plot/house societies, not
    # mixed-use neighborhoods. photo_entry is resolved through resolve_photo()
    # below — either a raw Unsplash photo id or a PLOT_COMPOSITES label.
    ("DHA Phase 6", "Lahore", 640, "photo-1600585154340-be6161a56a0c", 31.4697, 74.4142, None),
    ("DHA Phase 9", "Lahore", 190, "photo-1494526585095-c41746248156", 31.4432, 74.3805, None),
    ("Gulberg III", "Lahore", 310, "photo-1449824913935-59a10b8d2000", 31.5099, 74.3466, None),
    ("Bahria Town", "Lahore", 85, "photo-1570129477492-45c003edd2be", 31.3688, 74.1817, None),
    ("Model Town", "Lahore", 420, "photo-1512917774080-9991f1c4c750", 31.4805, 74.3235, None),
    ("Safari Garden", "Lahore", 55, "plot-field-road-1", 31.3587, 74.2008, Property.PropertyType.PLOT),
    ("Bahria EMC", "Lahore", 75, "plot-bare-dirt-1", 31.3652, 74.1774, Property.PropertyType.PLOT),
    ("Central Park Housing Scheme", "Lahore", 230, "photo-1691749457417-74193b07ca1b", 31.3989, 74.2296, Property.PropertyType.HOUSE),
]

# Societies with their own plot/house numbering + block, instead of the
# generic "Street 12, <neighborhood>" format used elsewhere.
PLOT_SCHEME_BLOCKS = {
    "Safari Garden": "C Block",
    "Bahria EMC": "Block B",
}
HOUSE_SCHEME_BLOCKS = {
    "Central Park Housing Scheme": "Block D",
}
MARLA_SIZES = ["5 Marla", "8 Marla", "10 Marla"]

AGENTS = [
    # username, first, last, brokerage, designation, phone, photo (Unsplash id)
    ("ayesha.tariq", "Ayesha", "Tariq", "Joiya Verified", "Senior Sales Agent", "+92 300 1234567", "photo-1758518729466-827cd8293992"),
    ("bilal.sheikh", "Bilal", "Sheikh", "Meridian Estates", "Property Consultant", "+92 301 2345678", "photo-1637589274742-8d4c152720a2"),
    ("hina.qureshi", "Hina", "Qureshi", "Joiya Verified", "Team Lead", "+92 302 3456789", "photo-1611682060567-d7b07878d380"),
    ("usman.raza", "Usman", "Raza", "Crestline Realty", "Senior Sales Agent", "+92 303 4567890", "photo-1621015600168-93f41e9c2810"),
]

# The one featured Founder & Owner profile, shown above the regular agent
# grid — separate from AGENTS above since it carries extra bio/experience
# content that regular agent cards don't show. Placeholder copy, demo data.
FOUNDER = {
    "username": "asif.joiya",
    "first_name": "Asif",
    "last_name": "Joiya",
    "brokerage": "Joiya Property Channel",
    "designation": "Founder & Owner",
    # Real contact numbers (comma-separated — FounderSection renders each as
    # its own tel: link) and real email, not auto-generated placeholders.
    "phone": "0333 3030124, 0306 7864121",
    "email": "M.asifkhan3030143@gmail.com",
    "photo": "photo-1787100612654-67781fcf62da",  # fallback stock photo
    # Real uploaded photo's Cloudinary URL — takes priority over the stock
    # "photo" fallback above when set.
    "photo_url": "https://res.cloudinary.com/ddn36iad6/image/upload/v1791112650/joiya/seed/joiya-founder-asif-joiya.jpg",
    "bio": (
        "Asif Joiya has spent over a decade building Joiya Property Channel into one of "
        "Lahore's most trusted names in real estate. Known for his hands-on approach and "
        "deep knowledge of the city's housing schemes, he's guided hundreds of families to "
        "a plot or home they could call their own."
    ),
    "experience_highlights": (
        "Over 12 years of experience in Lahore real estate, specializing in plot sales, "
        "housing scheme development, and client advisory.\n"
        "Built and manages a verified network of agents across DHA, Bahria Town, and "
        "Lahore's major housing societies."
    ),
}

STREETS = [
    "Street 12", "Block D", "Sector C", "Mini Market", "Cavalry Ground",
    "Zaman Park", "Faisal Town", "Township Sector",
]

# Plot photos: an aerial land photo with a red boundary line and corner pins
# composited over it at seed-time — the marked-plot look used by Pakistani
# real estate marketing (Zameen, Graana), which doesn't exist as stock
# photography to hotlink. Each label maps to a base Unsplash photo + the
# boundary box (as fractions of width/height) to draw on it; the composite
# is generated once and uploaded to Cloudinary, never stored in this repo.
PLOT_COMPOSITES = {
    "plot-field-road-1": ("photo-1475082622110-f0e90ff503ff", (0.08, 0.40, 0.62, 0.92)),
    "plot-field-road-2": ("photo-1475082622110-f0e90ff503ff", (0.40, 0.08, 0.95, 0.55)),
    "plot-grid-lines-1": ("photo-1700503819014-60a36ddd10f8", (0.30, 0.10, 0.78, 0.90)),
    "plot-bare-dirt-1": ("photo-1721137532032-4caaaf45c438", (0.42, 0.06, 0.98, 0.70)),
    "plot-bare-dirt-2": ("photo-1721137532032-4caaaf45c438", (0.40, 0.30, 0.90, 0.95)),
}
PLOT_PHOTOS = list(PLOT_COMPOSITES.keys())
# Real, freely-licensed Unsplash photos of modern concrete houses with
# boundary walls/gates — closer to Lahore/Karachi residential architecture
# than a Western suburban home.
HOUSE_PHOTOS = [
    "photo-1691749457417-74193b07ca1b",
    "photo-1790212763348-dc86d1820b6a",
    "photo-1613850011958-cfb3e7364058",
    "photo-1790213680397-d86b221c762a",
    "photo-1684691376857-5dfb87f6bc65",
    "photo-1787672357650-36b6b7037db7",
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


def _unsplash_url(photo_id, width=1200, height=800):
    return f"https://images.unsplash.com/{photo_id}?w={width}&h={height}&fit=crop&auto=format"


# Every distinct photo is uploaded to Cloudinary at most once per seed run
# (this cache), and Cloudinary itself no-ops repeat uploads of the same
# public_id across runs (upload_remote/upload_marked_plot use
# overwrite=False) — so re-running `seed` on every container start doesn't
# re-upload anything.
_resolved_photo_cache = {}


def resolve_photo(entry):
    if entry not in _resolved_photo_cache:
        if entry in PLOT_COMPOSITES:
            base_photo_id, box = PLOT_COMPOSITES[entry]
            url = None
            if cloudinary_images.is_configured():
                try:
                    url = cloudinary_images.upload_marked_plot(_unsplash_url(base_photo_id), box, public_id=entry)
                except Exception as e:  # noqa: BLE001
                    print(f"Cloudinary upload failed for {entry}, falling back to plain photo: {e}")
            if url is None:
                # No Cloudinary configured (or the upload failed) — fall back
                # to the plain aerial photo (no red boundary marking, since
                # that needs the compositing step to land somewhere hostable).
                url = _unsplash_url(base_photo_id)
        else:
            url = None
            if cloudinary_images.is_configured():
                try:
                    url = cloudinary_images.upload_remote(
                        _unsplash_url(entry), public_id=entry.replace("photo-", "unsplash-")
                    )
                except Exception as e:  # noqa: BLE001
                    print(f"Cloudinary upload failed for {entry}, falling back to direct hotlink: {e}")
            if url is None:
                url = _unsplash_url(entry)
        _resolved_photo_cache[entry] = url
    return _resolved_photo_cache[entry]


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
        if not cloudinary_images.is_configured():
            self.stdout.write(
                self.style.WARNING(
                    "CLOUDINARY_CLOUD_NAME/CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET not set — "
                    "falling back to hotlinked Unsplash photos (plots won't have the red "
                    "boundary marking). Set these to host demo photos on Cloudinary instead."
                )
            )

        admin_user, _ = User.objects.update_or_create(
            username="admin",
            defaults={
                "email": "admin@joiyapropertychannel.com",
                "is_staff": True,
                "is_superuser": True,
                "is_active": True,
            },
        )
        admin_user.set_password("AdminJPC")
        admin_user.save(update_fields=["password"])

        neighborhoods = []
        neighborhood_centers = {}
        neighborhood_forced_types = {}
        for name, city, median, photo_id, lat, lng, forced_type in NEIGHBORHOODS:
            obj, _ = Neighborhood.objects.get_or_create(
                name=name,
                city=city,
                defaults={
                    "slug": name.lower().replace(" ", "-"),
                    "median_price_lac": median,
                    "cover_image_url": resolve_photo(photo_id),
                },
            )
            neighborhoods.append(obj)
            neighborhood_centers[obj.id] = (lat, lng)
            neighborhood_forced_types[obj.id] = forced_type

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
        for username, first, last, brokerage, designation, phone, photo in AGENTS:
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
            agent, _ = Agent.objects.update_or_create(
                user=user,
                defaults={
                    "brokerage": brokerage,
                    "designation": designation,
                    "phone": phone,
                    "photo_url": resolve_photo(photo),
                    "is_verified": True,
                },
            )
            agents.append(agent)

        founder_user, _ = User.objects.update_or_create(
            username=FOUNDER["username"],
            defaults={
                "first_name": FOUNDER["first_name"],
                "last_name": FOUNDER["last_name"],
                "email": FOUNDER["email"],
                "role": User.Role.AGENT,
                "is_active": True,
            },
        )
        founder_agent, _ = Agent.objects.update_or_create(
            user=founder_user,
            defaults={
                "brokerage": FOUNDER["brokerage"],
                "designation": FOUNDER["designation"],
                "phone": FOUNDER["phone"],
                "photo_url": FOUNDER["photo_url"] or resolve_photo(FOUNDER["photo"]),
                "bio": FOUNDER["bio"],
                "experience_highlights": FOUNDER["experience_highlights"],
                "is_verified": True,
                "is_founder": True,
            },
        )
        agents.append(founder_agent)

        types = [c[0] for c in Property.PropertyType.choices]
        statuses = [c[0] for c in Property.ListingStatus.choices]
        now = timezone.now()
        count = options["count"]

        created = 0
        for _i in range(count):
            neighborhood = random.choice(neighborhoods)
            agent = random.choice(agents)
            forced_type = neighborhood_forced_types[neighborhood.id]
            prop_type = forced_type or random.choices(types, weights=[45, 30, 15, 10], k=1)[0]
            is_plot = prop_type == Property.PropertyType.PLOT
            price_lac = random.randint(60, 900)
            center_lat, center_lng = neighborhood_centers[neighborhood.id]
            # Small jitter (~within a couple km) so properties in the same
            # neighborhood don't all stack on one map point.
            jitter = lambda: random.uniform(-0.008, 0.008)  # noqa: E731

            if neighborhood.name in PLOT_SCHEME_BLOCKS:
                address = f"Plot {random.randint(10, 900)}, {PLOT_SCHEME_BLOCKS[neighborhood.name]}, {neighborhood.name}"
                plot_size = random.choice(MARLA_SIZES)
            elif neighborhood.name in HOUSE_SCHEME_BLOCKS:
                address = f"House No. {random.randint(1, 500)}, {HOUSE_SCHEME_BLOCKS[neighborhood.name]}, {neighborhood.name}"
                plot_size = random.choice(["5 Marla", "10 Marla", "1 Kanal"])
            else:
                address = f"{random.choice(STREETS)}, {neighborhood.name}"
                plot_size = (
                    random.choice(["5 Marla", "10 Marla", "1 Kanal", "2 Kanal"])
                    if is_plot
                    else random.choice(["Penthouse", "2 Kanal", "1 Kanal"])
                )

            property_obj = Property.objects.create(
                agent=agent,
                neighborhood=neighborhood,
                type=prop_type,
                status=random.choice(statuses),
                address=address,
                price_lac=price_lac,
                latitude=round(center_lat + jitter(), 6),
                longitude=round(center_lng + jitter(), 6),
                plot_size=plot_size,
                lot_size_sqft=random.randint(2500, 12000),
                beds=None if is_plot else random.randint(2, 6),
                baths=None if is_plot else random.randint(2, 5),
                sqft=None if is_plot else random.randint(1200, 4500),
                year_built=None if is_plot else random.randint(1985, 2024),
                cover_image_url=resolve_photo(random.choice(PHOTO_BY_TYPE[prop_type])),
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
                    PropertyImage(property=property_obj, url=resolve_photo(photo_id), order=i)
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
        self.stdout.write(
            self.style.WARNING(
                "Admin user ready — email: admin@joiyapropertychannel.com, password: AdminJPC "
                "(change this before deploying anywhere real)."
            )
        )

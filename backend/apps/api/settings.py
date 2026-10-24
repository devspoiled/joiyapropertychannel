from os import environ
from pathlib import Path

from django.core.exceptions import ImproperlyConfigured
from django.core.management.utils import get_random_secret_key
from django.templatetags.static import static
from django.urls import reverse_lazy
from django.utils.translation import gettext_lazy as _

######################################################################
# General
######################################################################
BASE_DIR = Path(__file__).resolve().parent.parent.parent

DEBUG = environ.get("DEBUG", "") == "1"


def _require_env(name: str) -> str:
    """In production, a missing secret must fail startup loudly rather than
    silently fall back to a weak default — DEBUG-mode local dev is exempt
    so the app still runs out of the box without a .env file."""
    value = environ.get(name, "")
    if not value and not DEBUG:
        raise ImproperlyConfigured(f"{name} must be set when DEBUG is off.")
    return value


SECRET_KEY = _require_env("SECRET_KEY") or get_random_secret_key()

ALLOWED_HOSTS = ["localhost", "api"] + [
    host.strip().removeprefix("https://").removeprefix("http://").rstrip("/")
    for host in environ.get("ALLOWED_HOSTS", "").split(",")
    if host.strip()
]

CSRF_TRUSTED_ORIGINS = [
    origin.strip() if "://" in origin.strip() else f"https://{origin.strip()}"
    for origin in environ.get("CSRF_TRUSTED_ORIGINS", "").split(",")
    if origin.strip()
]

# Shared secret the frontend's auth server sends when bridging a verified
# social login (e.g. Google) into a Django JWT — proves the call comes from
# our own server, not a browser. See apps.users.views.SocialLoginView.
INTERNAL_AUTH_SECRET = environ.get("INTERNAL_AUTH_SECRET", "")

######################################################################
# HTTPS / cookie security — off in DEBUG so local http dev is unaffected.
# Traefik (Coolify's proxy) terminates TLS and forwards plain HTTP to this
# container, so SECURE_PROXY_SSL_HEADER is required for Django to recognize
# the original request as secure.
######################################################################
if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True

######################################################################
# Cloudinary (image hosting for seeded/demo listing photos)
######################################################################
CLOUDINARY_CLOUD_NAME = environ.get("CLOUDINARY_CLOUD_NAME", "")
CLOUDINARY_API_KEY = environ.get("CLOUDINARY_API_KEY", "")
CLOUDINARY_API_SECRET = environ.get("CLOUDINARY_API_SECRET", "")

######################################################################
# Contact form (Resend)
######################################################################
RESEND_API_KEY = environ.get("RESEND_API_KEY", "")
CONTACT_EMAIL_FROM = environ.get("CONTACT_EMAIL_FROM", "onboarding@resend.dev")
# Fixed destination for every contact form submission — not configurable
# per-request, this is where site inquiries always go.
CONTACT_EMAIL_TO = "M.asifkhan3030143@gmail.com"

if CLOUDINARY_CLOUD_NAME:
    import cloudinary

    cloudinary.config(
        cloud_name=CLOUDINARY_CLOUD_NAME,
        api_key=CLOUDINARY_API_KEY,
        api_secret=CLOUDINARY_API_SECRET,
        secure=True,
    )

WSGI_APPLICATION = "apps.api.wsgi.application"

ROOT_URLCONF = "apps.api.urls"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

######################################################################
# Apps
######################################################################
INSTALLED_APPS = [
    "unfold",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "rest_framework_simplejwt",
    "drf_spectacular",
    "apps.api",
    "apps.users",
    "apps.agents",
    "apps.neighborhoods",
    "apps.properties",
    "apps.tax_history",
    "apps.price_history",
    "apps.schools",
    "apps.hospitals",
    "seeding",
]

######################################################################
# Middleware
######################################################################
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

######################################################################
# Templates
######################################################################
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

######################################################################
# Database
######################################################################
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "USER": environ.get("DATABASE_USER", "postgres"),
        "PASSWORD": _require_env("DATABASE_PASSWORD") or "change-password",
        "NAME": environ.get("DATABASE_NAME", "db"),
        "HOST": environ.get("DATABASE_HOST", "db"),
        "PORT": "5432",
        "TEST": {
            "NAME": "test",
        },
    }
}

######################################################################
# Authentication
######################################################################
AUTH_USER_MODEL = "users.User"

# EmailBackend lets the Django admin log in with email + password.
# ModelBackend stays enabled so username-based auth (the frontend's API
# login flow) keeps working unchanged.
AUTHENTICATION_BACKENDS = [
    "apps.users.backends.EmailBackend",
    "django.contrib.auth.backends.ModelBackend",
]

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

######################################################################
# Internationalization
######################################################################
LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True

######################################################################
# Staticfiles
######################################################################
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STORAGES = {
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

######################################################################
# Rest Framework
######################################################################
REST_FRAMEWORK = {
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 10,
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
}

######################################################################
# Unfold
######################################################################
UNFOLD = {
    "SITE_HEADER": _("Joiya Property Channel"),
    "SITE_TITLE": _("Joiya Property Channel Admin"),
    "SITE_SYMBOL": "home_work",
    "SITE_LOGO": {
        "light": lambda request: static("dashboard/logo.png"),
        "dark": lambda request: static("dashboard/logo-light.png"),
    },
    "SITE_FAVICONS": [
        {
            "rel": "icon",
            "type": "image/svg+xml",
            "href": lambda request: static("dashboard/favicon.svg"),
        },
    ],
    "SHOW_HISTORY": True,
    "SHOW_VIEW_ON_SITE": True,
    "COLORS": {
        "primary": {
            "50": "240 248 241",
            "100": "223 240 226",
            "200": "191 224 198",
            "300": "159 208 170",
            "400": "127 191 141",
            "500": "78 158 92",
            "600": "47 107 58",
            "700": "37 85 47",
            "800": "30 68 38",
            "900": "24 54 30",
            "950": "16 36 20",
        },
        # Page background scale: 50 (light mode bg) near-white, 900/950 (dark mode bg) deep
        # navy-black — a flat pure #000 read as harsh/cheap rather than professional.
        "base": {
            "50": "255 255 255",
            "100": "245 245 245",
            "200": "229 229 229",
            "300": "203 213 225",
            "400": "148 163 184",
            "500": "100 116 139",
            "600": "71 85 105",
            "700": "51 65 85",
            "800": "26 30 47",
            "900": "14 18 35",
            "950": "2 6 23",
        },
    },
    "SIDEBAR": {
        "show_search": True,
        "show_all_applications": False,
        "navigation": [
            {
                "title": _("Navigation"),
                "separator": False,
                "items": [
                    {
                        "title": _("Dashboard"),
                        "icon": "dashboard",
                        "link": reverse_lazy("dashboard"),
                    },
                    {
                        "title": _("Users"),
                        "icon": "person",
                        "link": reverse_lazy("admin:users_user_changelist"),
                    },
                    {
                        "title": _("Groups"),
                        "icon": "label",
                        "link": reverse_lazy("admin:auth_group_changelist"),
                    },
                    {
                        "title": _("Agents"),
                        "icon": "badge",
                        "link": reverse_lazy("admin:agents_agent_changelist"),
                    },
                    {
                        "title": _("Neighborhoods"),
                        "icon": "location_city",
                        "link": reverse_lazy(
                            "admin:neighborhoods_neighborhood_changelist"
                        ),
                    },
                    {
                        "title": _("Properties"),
                        "icon": "home_work",
                        "link": reverse_lazy("admin:properties_property_changelist"),
                    },
                    {
                        "title": _("Saved Properties"),
                        "icon": "favorite",
                        "link": reverse_lazy("admin:properties_savedproperty_changelist"),
                    },
                    {
                        "title": _("Price History"),
                        "icon": "trending_up",
                        "link": reverse_lazy(
                            "admin:price_history_pricehistory_changelist"
                        ),
                    },
                    {
                        "title": _("Tax History"),
                        "icon": "receipt_long",
                        "link": reverse_lazy("admin:tax_history_taxhistory_changelist"),
                    },
                    {
                        "title": _("Schools"),
                        "icon": "school",
                        "link": reverse_lazy("admin:schools_school_changelist"),
                    },
                    {
                        "title": _("Hospitals"),
                        "icon": "local_hospital",
                        "link": reverse_lazy("admin:hospitals_hospital_changelist"),
                    },
                ],
            },
        ],
    },
}

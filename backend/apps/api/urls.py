from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.api.dashboard import dashboard_view

urlpatterns = [
    path("admin/dashboard/", dashboard_view, name="dashboard"),
    path(
        "api/schema/swagger-ui/",
        SpectacularSwaggerView.as_view(url_name="schema"),
    ),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/", include("apps.users.urls")),
    path("api/", include("apps.agents.urls")),
    path("api/", include("apps.neighborhoods.urls")),
    path("api/", include("apps.properties.urls")),
    path("api/", include("apps.tax_history.urls")),
    path("api/", include("apps.price_history.urls")),
    path("api/", include("apps.schools.urls")),
    path("api/", include("apps.hospitals.urls")),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("admin/", admin.site.urls),
]

from rest_framework import routers

from .views import PropertyViewSet

router = routers.DefaultRouter()
router.register("properties", PropertyViewSet, basename="properties")

urlpatterns = router.urls

from rest_framework import routers

from .views import PriceHistoryViewSet

router = routers.DefaultRouter()
router.register("price-history", PriceHistoryViewSet, basename="price-history")

urlpatterns = router.urls

from rest_framework import routers

from .views import TaxHistoryViewSet

router = routers.DefaultRouter()
router.register("tax-history", TaxHistoryViewSet, basename="tax-history")

urlpatterns = router.urls

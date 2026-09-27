from rest_framework import routers

from .views import NeighborhoodViewSet

router = routers.DefaultRouter()
router.register("neighborhoods", NeighborhoodViewSet, basename="neighborhoods")

urlpatterns = router.urls

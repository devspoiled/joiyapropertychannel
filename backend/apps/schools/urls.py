from rest_framework import routers

from .views import SchoolViewSet

router = routers.DefaultRouter()
router.register("schools", SchoolViewSet, basename="schools")

urlpatterns = router.urls

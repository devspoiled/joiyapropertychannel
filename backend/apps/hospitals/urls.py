from rest_framework import routers

from .views import HospitalViewSet

router = routers.DefaultRouter()
router.register("hospitals", HospitalViewSet, basename="hospitals")

urlpatterns = router.urls

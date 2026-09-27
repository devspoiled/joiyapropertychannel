from rest_framework import routers

from .views import AgentViewSet

router = routers.DefaultRouter()
router.register("agents", AgentViewSet, basename="agents")

urlpatterns = router.urls

from django.urls import path
from rest_framework import routers

from .views import SocialLoginView, UserViewSet

router = routers.DefaultRouter()
router.register("users", UserViewSet, basename="users")

urlpatterns = router.urls + [
    path("auth/social/", SocialLoginView.as_view(), name="social_login"),
]

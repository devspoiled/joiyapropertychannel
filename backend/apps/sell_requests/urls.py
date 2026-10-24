from django.urls import path

from .views import SellRequestCreateView

urlpatterns = [
    path("sell-requests/", SellRequestCreateView.as_view(), name="sell_request"),
]

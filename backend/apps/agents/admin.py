from unfold.admin import ModelAdmin

from django.contrib import admin
from django.db.models import Count, Q

from .models import Agent


@admin.register(Agent)
class AgentAdmin(ModelAdmin):
    list_display = ["__str__", "designation", "phone", "brokerage", "listing_count", "is_verified", "is_founder"]
    list_filter = ["is_verified", "is_founder"]
    search_fields = ["user__username", "user__email", "brokerage", "phone"]
    autocomplete_fields = ["user"]

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .annotate(listing_count=Count("properties", filter=Q(properties__is_active=True), distinct=True))
        )

    @admin.display(description="Active listings", ordering="listing_count")
    def listing_count(self, obj):
        return obj.listing_count

from unfold.admin import ModelAdmin

from django.contrib import admin

from .models import PriceHistory


@admin.register(PriceHistory)
class PriceHistoryAdmin(ModelAdmin):
    list_display = ["property", "event", "price_lac", "date"]
    list_filter = ["event"]
    search_fields = ["property__address"]
    autocomplete_fields = ["property"]

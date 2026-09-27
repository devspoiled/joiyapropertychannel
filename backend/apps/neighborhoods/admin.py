from unfold.admin import ModelAdmin

from django.contrib import admin

from .models import Neighborhood


@admin.register(Neighborhood)
class NeighborhoodAdmin(ModelAdmin):
    list_display = ["name", "city", "median_price_lac"]
    list_filter = ["city"]
    search_fields = ["name", "city"]
    prepopulated_fields = {"slug": ["name"]}

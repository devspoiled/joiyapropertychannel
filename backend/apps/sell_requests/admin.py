from unfold.admin import ModelAdmin

from django.contrib import admin

from .models import SellRequest


@admin.register(SellRequest)
class SellRequestAdmin(ModelAdmin):
    list_display = [
        "name",
        "phone",
        "property_type",
        "city",
        "demanding_price_lac",
        "review_status",
        "created_at",
    ]
    list_filter = ["review_status", "property_type", "city"]
    list_editable = ["review_status"]
    search_fields = ["name", "email", "phone", "address", "city"]
    readonly_fields = [
        "name",
        "email",
        "phone",
        "property_type",
        "address",
        "city",
        "demanding_price_lac",
        "latitude",
        "longitude",
        "created_at",
    ]

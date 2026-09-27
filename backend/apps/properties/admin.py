from unfold.admin import ModelAdmin, TabularInline

from django.contrib import admin

from .models import Property, PropertyImage


class PropertyImageInline(TabularInline):
    model = PropertyImage
    extra = 1
    fields = ["url", "order"]


@admin.register(Property)
class PropertyAdmin(ModelAdmin):
    list_display = ["address", "type", "status", "price_lac", "neighborhood", "agent"]
    list_filter = ["type", "status", "neighborhood__city"]
    search_fields = ["address"]
    autocomplete_fields = ["agent", "neighborhood", "owner"]
    inlines = [PropertyImageInline]

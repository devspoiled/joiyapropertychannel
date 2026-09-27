from unfold.admin import ModelAdmin

from django.contrib import admin

from .models import Hospital


@admin.register(Hospital)
class HospitalAdmin(ModelAdmin):
    list_display = ["name", "specialty", "contact"]
    search_fields = ["name", "specialty"]

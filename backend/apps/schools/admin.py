from unfold.admin import ModelAdmin

from django.contrib import admin

from .models import School


@admin.register(School)
class SchoolAdmin(ModelAdmin):
    list_display = ["name", "type", "grade_levels", "city", "website"]
    list_filter = ["type", "city"]
    search_fields = ["name"]

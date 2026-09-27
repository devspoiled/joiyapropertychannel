from unfold.admin import ModelAdmin

from django.contrib import admin

from .models import TaxHistory


@admin.register(TaxHistory)
class TaxHistoryAdmin(ModelAdmin):
    list_display = ["property", "year", "tax_paid_lac", "assessed_value_lac"]
    list_filter = ["year"]
    search_fields = ["property__address"]
    autocomplete_fields = ["property"]

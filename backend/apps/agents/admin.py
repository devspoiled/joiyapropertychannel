from unfold.admin import ModelAdmin

from django.contrib import admin

from .models import Agent


@admin.register(Agent)
class AgentAdmin(ModelAdmin):
    list_display = ["__str__", "brokerage", "is_verified"]
    list_filter = ["is_verified"]
    search_fields = ["user__username", "user__email", "brokerage"]
    autocomplete_fields = ["user"]

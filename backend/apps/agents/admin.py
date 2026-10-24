from unfold.admin import ModelAdmin

from django import forms
from django.contrib import admin
from django.db.models import Count, Q

from seeding import cloudinary_images

from .models import Agent


class AgentAdminForm(forms.ModelForm):
    photo_upload = forms.ImageField(required=False, label="Upload photo")

    class Meta:
        model = Agent
        fields = "__all__"
        widgets = {"photo_url": forms.HiddenInput()}

    def clean(self):
        cleaned = super().clean()
        upload = cleaned.get("photo_upload")
        if upload:
            if not cloudinary_images.is_configured():
                self.add_error("photo_upload", "Cloudinary isn't configured on this server.")
            else:
                cleaned["photo_url"] = cloudinary_images.upload_file(upload, folder="joiya/agents")
        return cleaned


@admin.register(Agent)
class AgentAdmin(ModelAdmin):
    form = AgentAdminForm
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

from unfold.admin import ModelAdmin

from django import forms
from django.contrib import admin

from seeding import cloudinary_images

from .models import Neighborhood


class NeighborhoodAdminForm(forms.ModelForm):
    cover_image_upload = forms.ImageField(required=False, label="Upload cover image")

    class Meta:
        model = Neighborhood
        fields = "__all__"
        widgets = {"cover_image_url": forms.HiddenInput()}

    def clean(self):
        cleaned = super().clean()
        upload = cleaned.get("cover_image_upload")
        if upload:
            if not cloudinary_images.is_configured():
                self.add_error("cover_image_upload", "Cloudinary isn't configured on this server.")
            else:
                cleaned["cover_image_url"] = cloudinary_images.upload_file(upload, folder="joiya/neighborhoods")
        return cleaned


@admin.register(Neighborhood)
class NeighborhoodAdmin(ModelAdmin):
    form = NeighborhoodAdminForm
    list_display = ["name", "city", "median_price_lac"]
    list_filter = ["city"]
    search_fields = ["name", "city"]
    prepopulated_fields = {"slug": ["name"]}

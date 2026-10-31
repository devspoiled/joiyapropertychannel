from unfold.admin import ModelAdmin, TabularInline

from django import forms
from django.contrib import admin

from seeding import cloudinary_images

from .models import Property, PropertyFeature, PropertyImage, SavedProperty
from .widgets import FeatureCheckboxDropdown


class PropertyImageInlineForm(forms.ModelForm):
    image_upload = forms.ImageField(required=False, label="Upload image")

    class Meta:
        model = PropertyImage
        fields = ["url", "order", "image_upload"]
        widgets = {"url": forms.HiddenInput()}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["url"].required = False

    def clean(self):
        cleaned = super().clean()
        if cleaned.get("DELETE"):
            return cleaned
        upload = cleaned.get("image_upload")
        if upload:
            if not cloudinary_images.is_configured():
                self.add_error("image_upload", "Cloudinary isn't configured on this server.")
            else:
                cleaned["url"] = cloudinary_images.upload_file(upload, folder="joiya/properties")
        elif not cleaned.get("url"):
            self.add_error("image_upload", "Upload an image.")
        return cleaned


class PropertyImageInline(TabularInline):
    model = PropertyImage
    form = PropertyImageInlineForm
    extra = 1
    fields = ["url", "image_upload", "order"]


class PropertyAdminForm(forms.ModelForm):
    cover_image_upload = forms.ImageField(required=False, label="Upload cover image")
    # Declared explicitly (not just via Meta.widgets) so the admin's default
    # formfield_for_manytomany wrapping — the stray "+" icon that opens a
    # raw add page instead of a popup, and doesn't work for a checkbox list
    # anyway — never gets applied to this field.
    features = forms.ModelMultipleChoiceField(
        queryset=PropertyFeature.objects.all(), required=False, widget=FeatureCheckboxDropdown
    )

    class Meta:
        model = Property
        fields = "__all__"
        widgets = {"cover_image_url": forms.HiddenInput()}

    def clean(self):
        cleaned = super().clean()
        upload = cleaned.get("cover_image_upload")
        if upload:
            if not cloudinary_images.is_configured():
                self.add_error("cover_image_upload", "Cloudinary isn't configured on this server.")
            else:
                cleaned["cover_image_url"] = cloudinary_images.upload_file(upload, folder="joiya/properties")
        return cleaned


@admin.register(PropertyFeature)
class PropertyFeatureAdmin(ModelAdmin):
    list_display = ["name", "category"]
    list_filter = ["category"]
    search_fields = ["name"]


@admin.register(Property)
class PropertyAdmin(ModelAdmin):
    form = PropertyAdminForm
    list_display = ["address", "type", "status", "price_lac", "neighborhood", "agent"]
    list_filter = ["type", "status", "neighborhood__city"]
    search_fields = ["address"]
    autocomplete_fields = ["agent", "neighborhood"]
    inlines = [PropertyImageInline]


@admin.register(SavedProperty)
class SavedPropertyAdmin(ModelAdmin):
    list_display = ["user", "property", "created_at"]
    list_filter = ["created_at"]
    search_fields = ["user__username", "user__email", "property__address"]
    autocomplete_fields = ["user", "property"]

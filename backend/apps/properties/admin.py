from unfold.admin import ModelAdmin, TabularInline

from django import forms
from django.contrib import admin
from django.http import JsonResponse
from django.urls import path

from apps.hospitals.models import Hospital
from apps.schools.models import School
from seeding import cloudinary_images

from .models import Property, PropertyFeature, PropertyImage, SavedProperty
from .widgets import CheckboxDropdown, FeatureCheckboxDropdown


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
    # Same reasoning: declared explicitly so neither field gets Django's
    # default related-field wrapping (which would add a "+ add another"
    # icon) — schools/hospitals are only ever created from their own admin
    # sections, never from within a property.
    nearby_schools = forms.ModelMultipleChoiceField(
        queryset=School.objects.all(),
        required=False,
        widget=CheckboxDropdown(lambda: School.objects.all(), "school", "schools"),
    )
    nearby_hospitals = forms.ModelMultipleChoiceField(
        queryset=Hospital.objects.all(),
        required=False,
        widget=CheckboxDropdown(lambda: Hospital.objects.all(), "hospital", "hospitals"),
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

    def get_urls(self):
        return [
            path(
                "quick-add/",
                self.admin_site.admin_view(self.quick_add_view),
                name="properties_propertyfeature_quick_add",
            ),
        ] + super().get_urls()

    def quick_add_view(self, request):
        """Backs the inline "Add new" mini-form in the features dropdown on
        the Property admin form — creates a PropertyFeature without leaving
        the page, no popup window involved."""
        if request.method != "POST":
            return JsonResponse({"detail": "POST required."}, status=405)
        name = request.POST.get("name", "").strip()
        category = request.POST.get("category", "")
        if not name or category not in PropertyFeature.Category.values:
            return JsonResponse({"detail": "A name and valid category are required."}, status=400)
        feature, _ = PropertyFeature.objects.get_or_create(name=name, category=category)
        return JsonResponse({"id": feature.pk, "name": feature.name, "category": feature.category})


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

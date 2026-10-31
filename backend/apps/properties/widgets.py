import json

from django import forms
from django.urls import reverse

from .models import PropertyFeature


class FeatureCheckboxDropdown(forms.SelectMultiple):
    """A single collapsed row that expands into features grouped by
    category, each with a checkbox. "Add new" is an inline mini-form in
    the same panel (name + category, submitted via fetch() to a small
    admin-scoped JSON endpoint) — no popup window, no new tab, nothing
    leaves the page. The whole panel is one Alpine component so a newly
    created feature appears as an already-checked option immediately."""

    template_name = "properties/widgets/feature_checkbox_dropdown.html"

    def get_context(self, name, value, attrs):
        context = super().get_context(name, value, attrs)
        selected = {str(v) for v in (value or [])}

        groups = []
        for category_value, category_label in PropertyFeature.Category.choices:
            features = [f for f in self._features if f.category == category_value]
            groups.append(
                {
                    "value": category_value,
                    "label": str(category_label),
                    "options": [
                        {"value": f.pk, "label": f.name, "selected": str(f.pk) in selected}
                        for f in features
                    ],
                }
            )

        # </script> can't appear literally inside a <script> body.
        def dump(data):
            return json.dumps(data).replace("</", "<\\/")

        context["widget"]["groups_json"] = dump(groups)
        context["widget"]["categories_json"] = dump(
            [{"value": v, "label": str(label)} for v, label in PropertyFeature.Category.choices]
        )
        context["widget"]["quick_add_url"] = reverse("admin:properties_propertyfeature_quick_add")
        return context

    @property
    def _features(self):
        # Already ordered by category then name via PropertyFeature.Meta.ordering.
        return PropertyFeature.objects.all()


class CheckboxDropdown(forms.SelectMultiple):
    """Same collapsed-row-to-checkbox-list pattern as FeatureCheckboxDropdown,
    for a plain (ungrouped) queryset — used for nearby_schools/nearby_hospitals.
    No "Add new": schools/hospitals are only ever created from their own admin
    sections, not from within a property."""

    template_name = "properties/widgets/checkbox_dropdown.html"

    def __init__(self, queryset_fn, noun_singular, noun_plural, attrs=None):
        super().__init__(attrs)
        self.queryset_fn = queryset_fn
        self.noun_singular = noun_singular
        self.noun_plural = noun_plural

    def get_context(self, name, value, attrs):
        context = super().get_context(name, value, attrs)
        selected = {str(v) for v in (value or [])}
        options = [
            {"value": str(obj.pk), "label": str(obj), "selected": str(obj.pk) in selected}
            for obj in self.queryset_fn()
        ]
        context["widget"]["options_json"] = json.dumps(options).replace("</", "<\\/")
        context["widget"]["noun_singular"] = self.noun_singular
        context["widget"]["noun_plural"] = self.noun_plural
        return context

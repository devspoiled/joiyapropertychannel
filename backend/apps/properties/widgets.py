from django import forms
from django.urls import reverse

from .models import PropertyFeature


class FeatureCheckboxDropdown(forms.SelectMultiple):
    """A single collapsed row that expands into features grouped by
    category, each with a checkbox, with an "Add new" action inside the
    same panel — instead of Unfold's default related-object icon floating
    outside the field (which doesn't work well for a checkbox list anyway,
    since there's no single <select> for it to update)."""

    template_name = "properties/widgets/feature_checkbox_dropdown.html"

    def get_context(self, name, value, attrs):
        context = super().get_context(name, value, attrs)
        selected = {str(v) for v in (value or [])}

        groups = []
        for category_value, category_label in PropertyFeature.Category.choices:
            features = [f for f in self._features if f.category == category_value]
            if not features:
                continue
            groups.append(
                {
                    "label": category_label,
                    "options": [
                        {"value": f.pk, "label": f.name, "selected": str(f.pk) in selected}
                        for f in features
                    ],
                }
            )

        context["widget"]["groups"] = groups
        context["widget"]["selected_count"] = len(selected)
        context["widget"]["add_url"] = reverse("admin:properties_propertyfeature_add") + "?_popup=1&_to_field=id"
        return context

    @property
    def _features(self):
        # Already ordered by category then name via PropertyFeature.Meta.ordering.
        return PropertyFeature.objects.all()

from django import forms
from django.utils.translation import gettext_lazy as _
from unfold.forms import AuthenticationForm as UnfoldAuthenticationForm


class EmailAuthenticationForm(UnfoldAuthenticationForm):
    """Admin login form that asks for an email instead of a username.

    Keeps the field named "username" so Django's auth machinery and
    Unfold's login template (which renders `form.username`) work
    unchanged — only the label/widget/validation are email-flavoured.
    The EmailBackend does the actual email -> user lookup.
    """

    username = forms.EmailField(
        label=_("Email"),
        widget=forms.EmailInput(attrs={"autofocus": True}),
    )

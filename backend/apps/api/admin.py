from django.contrib import admin

from apps.users.forms import EmailAuthenticationForm

# Admin logs in with email + password instead of username + password.
admin.site.login_form = EmailAuthenticationForm

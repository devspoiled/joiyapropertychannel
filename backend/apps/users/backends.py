from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

User = get_user_model()


class EmailBackend(ModelBackend):
    """Authenticate using email + password instead of username + password.

    Scoped to the Django admin login only — the frontend's own auth flow
    still authenticates by username via the API and is unaffected.
    """

    def authenticate(self, request, username=None, password=None, **kwargs):
        email = kwargs.get("email", username)
        if email is None or password is None:
            return None

        try:
            user = User.objects.get(email__iexact=email)
        except (User.DoesNotExist, User.MultipleObjectsReturned):
            return None

        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None

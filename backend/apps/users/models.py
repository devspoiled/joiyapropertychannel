from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.functions import Lower
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    class Role(models.TextChoices):
        CUSTOMER = "customer", _("Customer")
        AGENT = "agent", _("Agent")

    role = models.CharField(
        _("role"), max_length=20, choices=Role.choices, default=Role.CUSTOMER
    )
    created_at = models.DateTimeField(_("created at"), auto_now_add=True)
    modified_at = models.DateTimeField(_("modified at"), auto_now=True)

    class Meta:
        db_table = "users"
        verbose_name = _("user")
        verbose_name_plural = _("users")
        constraints = [
            models.UniqueConstraint(
                Lower("email"),
                name="unique_user_email_ci",
                condition=~models.Q(email=""),
            )
        ]

    def __str__(self):
        return self.email if self.email else self.username

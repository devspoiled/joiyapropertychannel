from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.api.models import UUIDModel


class Agent(UUIDModel):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="agent_profile",
        verbose_name=_("user"),
    )
    brokerage = models.CharField(_("brokerage"), max_length=150, blank=True)
    phone = models.CharField(_("phone"), max_length=30, blank=True)
    bio = models.TextField(_("bio"), blank=True)
    is_verified = models.BooleanField(_("verified"), default=False)
    created_at = models.DateTimeField(_("created at"), auto_now_add=True)
    modified_at = models.DateTimeField(_("modified at"), auto_now=True)

    class Meta:
        db_table = "agents"
        verbose_name = _("agent")
        verbose_name_plural = _("agents")
        ordering = ["-created_at"]

    def __str__(self):
        return self.user.get_full_name() or self.user.username

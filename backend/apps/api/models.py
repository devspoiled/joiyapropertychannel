import uuid

from django.db import models


class UUIDModel(models.Model):
    """Abstract base giving a model a UUID primary key instead of an
    auto-incrementing integer — used for models whose id is public-facing
    (e.g. in URLs) so sequential IDs don't leak listing counts/growth."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True

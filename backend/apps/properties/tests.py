from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from apps.agents.models import Agent
from apps.neighborhoods.models import Neighborhood

from .models import Property


class PropertySearchTests(TestCase):
    """Covers the `q` filter backing the hero search bar's suggestions."""

    def setUp(self):
        user = get_user_model().objects.create_user(
            username="agent1", password="x"
        )
        agent = Agent.objects.create(user=user)
        lahore = Neighborhood.objects.create(name="DHA Phase 6", city="Lahore")
        karachi = Neighborhood.objects.create(name="Clifton", city="Karachi")

        self.lahore_property = Property.objects.create(
            agent=agent,
            neighborhood=lahore,
            type=Property.PropertyType.HOUSE,
            address="123 Lahore Street",
            price_lac=100,
        )
        self.karachi_property = Property.objects.create(
            agent=agent,
            neighborhood=karachi,
            type=Property.PropertyType.HOUSE,
            address="45 Clifton Block",
            price_lac=200,
        )
        self.client = APIClient()

    def _addresses(self, q):
        response = self.client.get("/api/properties/", {"q": q})
        assert response.status_code == 200
        return {p["address"] for p in response.data["results"]}

    def test_matches_by_partial_city(self):
        # "lah" should surface the Lahore listing, per the 3-char suggestion trigger.
        self.assertEqual(self._addresses("lah"), {"123 Lahore Street"})

    def test_matches_by_address(self):
        self.assertEqual(self._addresses("Clifton Block"), {"45 Clifton Block"})

    def test_matches_by_neighborhood_name(self):
        self.assertEqual(self._addresses("DHA"), {"123 Lahore Street"})

    def test_no_match_returns_empty(self):
        self.assertEqual(self._addresses("Islamabad"), set())

import json
from datetime import timedelta

from django.contrib import admin
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth import get_user_model
from django.db.models import Avg, Count
from django.shortcuts import render
from django.utils import timezone

from apps.agents.models import Agent
from apps.hospitals.models import Hospital
from apps.neighborhoods.models import Neighborhood
from apps.properties.models import Property
from apps.schools.models import School

User = get_user_model()

TYPE_COLORS = {
    "plot": "#3B82F6",
    "house": "#10B981",
    "apartment": "#F59E0B",
    "villa": "#8B5CF6",
}


def _pct_change(current, previous):
    """Percent change vs previous period. None previous-count -> treated as 0."""
    if not previous:
        return 100.0 if current else 0.0
    return round((current - previous) / previous * 100, 1)


@staff_member_required
def dashboard_view(request):
    now = timezone.now()
    today = now.date()

    period_start = today - timedelta(days=29)
    prev_period_start = today - timedelta(days=59)
    prev_period_end = today - timedelta(days=30)

    properties_qs = Property.objects.filter(is_active=True)

    # --- Top stat cards (current 30d window vs prior 30d window) ---
    listings_now = Property.objects.filter(created_at__date__gte=period_start).count()
    listings_prev = Property.objects.filter(
        created_at__date__gte=prev_period_start, created_at__date__lte=prev_period_end
    ).count()

    users_now = User.objects.filter(date_joined__date__gte=period_start).count()
    users_prev = User.objects.filter(
        date_joined__date__gte=prev_period_start, date_joined__date__lte=prev_period_end
    ).count()

    agents_now = Agent.objects.filter(created_at__date__gte=period_start).count()
    agents_prev = Agent.objects.filter(
        created_at__date__gte=prev_period_start, created_at__date__lte=prev_period_end
    ).count()

    sold_now = properties_qs.filter(
        status=Property.ListingStatus.SOLD, modified_at__date__gte=period_start
    ).count()
    sold_prev = properties_qs.filter(
        status=Property.ListingStatus.SOLD,
        modified_at__date__gte=prev_period_start,
        modified_at__date__lte=prev_period_end,
    ).count()

    stat_cards = [
        {
            "label": "Active Listings",
            "value": f"{properties_qs.count():,}",
            "icon": "home",
            "delta": _pct_change(listings_now, listings_prev),
            "prev": f"{listings_prev:,} last period",
        },
        {
            "label": "Registered Users",
            "value": f"{User.objects.count():,}",
            "icon": "users",
            "delta": _pct_change(users_now, users_prev),
            "prev": f"{users_prev:,} last period",
        },
        {
            "label": "Verified Agents",
            "value": f"{Agent.objects.filter(is_verified=True).count():,}",
            "icon": "badge",
            "delta": _pct_change(agents_now, agents_prev),
            "prev": f"{agents_prev:,} last period",
        },
        {
            "label": "Sold Listings",
            "value": f"{properties_qs.filter(status=Property.ListingStatus.SOLD).count():,}",
            "icon": "cart",
            "delta": _pct_change(sold_now, sold_prev),
            "prev": f"{sold_prev:,} last period",
        },
    ]

    # --- Portfolio value area chart (sum of price_lac for listings created per day, last 30d) ---
    last_30_days = [period_start + timedelta(days=i) for i in range(30)]
    daily_totals = []
    running = 0
    for day in last_30_days:
        day_value = (
            Property.objects.filter(created_at__date=day).aggregate(v=Avg("price_lac"))["v"]
            or 0
        )
        running = round(day_value)
        daily_totals.append(running)

    chart_labels = [d.strftime("%-d %b") for d in last_30_days]
    total_value_lac = properties_qs.aggregate(v=Avg("price_lac"))["v"] or 0

    # --- Listings by type (breakdown bars) ---
    by_type = list(
        properties_qs.values("type").annotate(total=Count("id")).order_by("-total")
    )
    type_labels_map = {k: str(v) for k, v in Property.PropertyType.choices}
    max_type_total = max([r["total"] for r in by_type], default=1)
    type_breakdown = [
        {
            "label": type_labels_map.get(r["type"], r["type"]),
            "value": r["total"],
            "pct": round(r["total"] / max_type_total * 100),
            "color": TYPE_COLORS.get(r["type"], "#64748B"),
        }
        for r in by_type
    ]

    # --- Latest properties table ---
    latest_properties = list(
        properties_qs.select_related("agent__user", "neighborhood")
        .order_by("-created_at")[:6]
    )

    # --- Listings created per weekday (last 8 weeks) ---
    weekday_labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    since = today - timedelta(weeks=8)
    weekday_counts = [0] * 7
    for prop in Property.objects.filter(created_at__date__gte=since).only("created_at"):
        # Python weekday(): Mon=0..Sun=6; shift so Sun=0..Sat=6 to match labels.
        weekday_counts[(prop.created_at.weekday() + 1) % 7] += 1
    peak_index = weekday_counts.index(max(weekday_counts)) if any(weekday_counts) else 0

    # --- Verified agent rate gauge ---
    total_agents = Agent.objects.count()
    verified_agents = Agent.objects.filter(is_verified=True).count()
    verified_rate = round(verified_agents / total_agents * 100) if total_agents else 0

    weekday_max = max(weekday_counts) or 1
    weekdays = [
        {
            "name": name,
            "count": count,
            "pct": round(count / weekday_max * 100),
            "is_peak": i == peak_index,
        }
        for i, (name, count) in enumerate(zip(weekday_labels, weekday_counts))
    ]

    context = {
        **admin.site.each_context(request),
        "title": "Dashboard",
        "stat_cards": stat_cards,
        "chart_labels": json.dumps(chart_labels),
        "chart_values": json.dumps(daily_totals),
        "total_value_lac": f"{round(total_value_lac):,}",
        "type_breakdown": type_breakdown,
        "latest_properties": latest_properties,
        "weekdays": weekdays,
        "weekday_max": weekday_max,
        "verified_rate": verified_rate,
        "verified_agents": verified_agents,
        "total_agents": total_agents,
        "neighborhood_count": Neighborhood.objects.count(),
        "school_count": School.objects.count(),
        "hospital_count": Hospital.objects.count(),
    }
    return render(request, "dashboard/index.html", context)

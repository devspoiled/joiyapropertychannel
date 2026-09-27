from math import asin, cos, radians, sin, sqrt


def haversine_km(lat1, lng1, lat2, lng2):
    """Great-circle distance between two lat/lng points, in kilometres."""
    lat1, lng1, lat2, lng2 = map(radians, [lat1, lng1, lat2, lng2])
    dlat = lat2 - lat1
    dlng = lng2 - lng1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlng / 2) ** 2
    return 2 * 6371 * asin(sqrt(a))


def sort_by_distance(queryset, lat, lng, limit=None):
    """Given a queryset of objects with .latitude/.longitude, return a list
    sorted nearest-first with .distance_km set on each, optionally capped
    to `limit` results. Used by any "nearby X" viewset (schools, hospitals)."""
    lat, lng = float(lat), float(lng)
    items = list(queryset)
    for item in items:
        item.distance_km = round(haversine_km(lat, lng, float(item.latitude), float(item.longitude)), 1)
    items.sort(key=lambda i: i.distance_km)
    if limit:
        items = items[: int(limit)]
    return items

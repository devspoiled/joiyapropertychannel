from django.db.models import Q
from drf_spectacular.utils import OpenApiParameter, extend_schema, extend_schema_view
from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import Property
from .serializers import PropertyCardSerializer, PropertySerializer, PropertyWriteSerializer


class PropertyPagination(PageNumberPagination):
    page_size = 30
    page_size_query_param = "page_size"
    max_page_size = 100


@extend_schema_view(
    list=extend_schema(
        parameters=[
            OpenApiParameter("type", str, description="Filter by property type"),
            OpenApiParameter("city", str, description="Filter by neighborhood city"),
            OpenApiParameter("neighborhood", str, description="Filter by neighborhood id"),
            OpenApiParameter("price_max", int, description="Max price in Lac"),
            OpenApiParameter("beds", int, description="Minimum bedrooms"),
            OpenApiParameter(
                "q", str, description="Search by address, neighborhood or city"
            ),
        ]
    )
)
class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.select_related("agent__user", "neighborhood").filter(
        is_active=True
    )
    serializer_class = PropertySerializer
    permission_classes = [AllowAny]
    pagination_class = PropertyPagination

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            return [IsAuthenticated()]
        return super().get_permissions()

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return PropertyWriteSerializer
        if self.action == "list":
            return PropertyCardSerializer
        return super().get_serializer_class()

    def get_queryset(self):
        queryset = super().get_queryset()
        # Detail view needs the nested tax/price history too; list (card)
        # views only need images (for the card's hover carousel), so skip
        # the heavier prefetches there.
        if self.action == "retrieve":
            queryset = queryset.prefetch_related("images", "tax_history", "price_history")
        elif self.action == "list":
            queryset = queryset.prefetch_related("images")

        params = self.request.query_params

        type_ = params.get("type")
        if type_:
            queryset = queryset.filter(type=type_)

        city = params.get("city")
        if city:
            queryset = queryset.filter(neighborhood__city__iexact=city)

        neighborhood = params.get("neighborhood")
        if neighborhood:
            queryset = queryset.filter(neighborhood_id=neighborhood)

        price_max = params.get("price_max")
        if price_max:
            queryset = queryset.filter(price_lac__lte=price_max)

        beds = params.get("beds")
        if beds:
            queryset = queryset.filter(beds__gte=beds)

        q = params.get("q")
        if q:
            queryset = queryset.filter(
                Q(address__icontains=q)
                | Q(neighborhood__name__icontains=q)
                | Q(neighborhood__city__icontains=q)
            )

        return queryset

    @extend_schema(responses={200: PropertySerializer})
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

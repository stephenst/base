from django.contrib import admin

# Register your models here. admin user :pcharasala pwd: password123
from .models import Perspective
from .models import Scenario
from .models import Site
from .models import Resource
from .models import Asset
from .models import AssetResource
from .models import Route
from .models import RouteSegment
from .models import AssetRouteAssignment
from .models import RiskType
from .models import RiskArea
from .models import RiskAreaVertex
from .models import TimeToFailureDistribution

admin.site.register(Perspective)
admin.site.register(Scenario)
admin.site.register(Site)
admin.site.register(Resource)
admin.site.register(Asset)
admin.site.register(AssetResource)
admin.site.register(Route)
admin.site.register(RouteSegment)
admin.site.register(AssetRouteAssignment)
admin.site.register(RiskType)
admin.site.register(RiskArea)
admin.site.register(RiskAreaVertex)
admin.site.register(TimeToFailureDistribution)

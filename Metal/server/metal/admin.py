from django.contrib import admin

# Register your models here. admin user :pcharasala pwd: password123
from .models import Perspective
from .models import Scenario
from .models import Site
from .models import Resource
from .models import Asset
from .models import AssetResource
from .models import TimeToFailureDistribution

admin.site.register(Perspective)
admin.site.register(Scenario)
admin.site.register(Site)
admin.site.register(Resource)
admin.site.register(Asset)
admin.site.register(AssetResource)
admin.site.register(TimeToFailureDistribution)
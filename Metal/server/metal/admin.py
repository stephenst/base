from django.contrib import admin

# Register your models here. admin user :pcharasala pwd: password123
from .models import Stock
from .models import Perspective

admin.site.register(Stock)
admin.site.register(Perspective)
# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-07-19 18:34
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('metal', '0006_auto_20170718_1929'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='routesegment',
            name='index',
        ),
        migrations.AlterField(
            model_name='assetrouteassignment',
            name='asset',
            field=models.ForeignKey(default='default', on_delete=django.db.models.deletion.CASCADE, related_name='asset_route_assignments', to='metal.Asset'),
        ),
        migrations.AlterField(
            model_name='assetrouteassignment',
            name='route',
            field=models.ForeignKey(default='default', on_delete=django.db.models.deletion.CASCADE, related_name='asset_route_assignments', to='metal.Route'),
        ),
        migrations.AlterField(
            model_name='assetrouteassignment',
            name='scenario',
            field=models.ForeignKey(default='default', on_delete=django.db.models.deletion.CASCADE, related_name='asset_route_assignments', to='metal.Scenario'),
        ),
        migrations.AlterField(
            model_name='route',
            name='scenario',
            field=models.ForeignKey(default='default', on_delete=django.db.models.deletion.CASCADE, related_name='routes', to='metal.Scenario'),
        ),
        migrations.AlterField(
            model_name='routesegment',
            name='route',
            field=models.ForeignKey(default='default', on_delete=django.db.models.deletion.CASCADE, related_name='route_segments', to='metal.Route'),
        ),
    ]
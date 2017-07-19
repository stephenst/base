# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-07-18 19:29
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('metal', '0005_auto_20170718_0121'),
    ]

    operations = [
        migrations.CreateModel(
            name='AssetRouteAssignment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('count', models.IntegerField()),
                ('utilization', models.FloatField()),
                ('asset', models.ForeignKey(default='default', on_delete=django.db.models.deletion.CASCADE, to='metal.Asset')),
            ],
        ),
        migrations.CreateModel(
            name='Route',
            fields=[
                ('name', models.CharField(max_length=30, primary_key=True, serialize=False)),
                ('distance', models.FloatField()),
                ('scenario', models.ForeignKey(default='default', on_delete=django.db.models.deletion.CASCADE, to='metal.Scenario')),
            ],
        ),
        migrations.CreateModel(
            name='RouteSegment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('index', models.IntegerField()),
                ('start_latitude', models.FloatField()),
                ('start_longitude', models.FloatField()),
                ('end_latitude', models.FloatField()),
                ('end_longitude', models.FloatField()),
                ('distance', models.FloatField()),
                ('route', models.ForeignKey(default='default', on_delete=django.db.models.deletion.CASCADE, to='metal.Route')),
            ],
        ),
        migrations.AddField(
            model_name='assetrouteassignment',
            name='route',
            field=models.ForeignKey(default='default', on_delete=django.db.models.deletion.CASCADE, to='metal.Route'),
        ),
        migrations.AddField(
            model_name='assetrouteassignment',
            name='scenario',
            field=models.ForeignKey(default='default', on_delete=django.db.models.deletion.CASCADE, to='metal.Scenario'),
        ),
    ]

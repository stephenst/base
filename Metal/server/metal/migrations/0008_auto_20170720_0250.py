# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-07-20 02:50
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('metal', '0007_auto_20170719_1834'),
    ]

    operations = [
        migrations.AddField(
            model_name='timetofailuredistribution',
            name='x_axis_label',
            field=models.CharField(default='default', max_length=30),
        ),
        migrations.AddField(
            model_name='timetofailuredistribution',
            name='y_axis_label',
            field=models.CharField(default='default', max_length=30),
        ),
    ]

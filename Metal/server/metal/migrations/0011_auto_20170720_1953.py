# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-07-20 19:53
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('metal', '0010_merge_20170720_1847'),
    ]

    operations = [
        migrations.AddField(
            model_name='route',
            name='id',
            field=models.AutoField(auto_created=True, default=1, primary_key=True, serialize=False, verbose_name='ID'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='route',
            name='name',
            field=models.CharField(max_length=30),
        ),
    ]

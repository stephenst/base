# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-07-15 18:09
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('metal', '0003_auto_20170713_2235'),
    ]

    operations = [
        migrations.AddField(
            model_name='asset',
            name='scenario',
            field=models.ForeignKey(default='default', on_delete=django.db.models.deletion.CASCADE, to='metal.Scenario'),
        ),
        migrations.AlterField(
            model_name='assetresource',
            name='asset',
            field=models.ForeignKey(default='default', on_delete=django.db.models.deletion.CASCADE, to='metal.Asset'),
        ),
        migrations.AlterField(
            model_name='assetresource',
            name='resource',
            field=models.ForeignKey(default='default', on_delete=django.db.models.deletion.CASCADE, to='metal.Resource'),
        ),
        migrations.AlterField(
            model_name='resource',
            name='scenario',
            field=models.ForeignKey(default='default', on_delete=django.db.models.deletion.CASCADE, to='metal.Scenario'),
        ),
        migrations.AlterField(
            model_name='site',
            name='asset',
            field=models.ForeignKey(default='default', on_delete=django.db.models.deletion.CASCADE, to='metal.Asset'),
        ),
        migrations.AlterField(
            model_name='site',
            name='scenario',
            field=models.ForeignKey(default='default', on_delete=django.db.models.deletion.CASCADE, to='metal.Scenario'),
        ),
    ]

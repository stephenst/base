# -*- coding: utf-8 -*-
# Generated by Django 1.11.2 on 2017-07-10 16:14
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('metal', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Perspective',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('jsondata', models.TextField()),
                ('userid', models.CharField(max_length=20)),
            ],
        ),
    ]

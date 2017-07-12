# Django imports
from django.db import models


class Stock(models.Model):
    ticker = models.CharField(max_length=10)
    open = models.FloatField()
    close = models.FloatField()
    volume = models.IntegerField()

    def __str__(self):
        return self.ticker


class Perspective(models.Model):
    jsondata = models.TextField()
    userid = models.CharField(max_length=20)

    def __str__(self):
        return self.userid

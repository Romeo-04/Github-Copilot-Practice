from django.db import models


class Expense(models.Model):
    """Expense Model fields"""
    CATEGORY_CHOICES = (
        ('Food', 'Food'),
        ('Transport', 'Transport'),
        ('Entertainment', 'Entertainment'),
    )

    name = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=32, choices=CATEGORY_CHOICES)

    def __str__(self):
        return f'{self.name} - {self.amount}'


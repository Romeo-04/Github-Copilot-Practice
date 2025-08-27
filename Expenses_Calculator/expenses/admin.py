from django.contrib import admin
from .models import Expense

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'amount', 'timestamp', 'description', 'category')
    search_fields = ('name', 'category')
    list_filter = ('timestamp', 'category')
    ordering = ('-timestamp',)
    


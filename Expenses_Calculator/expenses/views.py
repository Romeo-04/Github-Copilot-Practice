from rest_framework import viewsets
from django.shortcuts import render
from .models import Expense
from .serializers import ExpenseSerializer

# Create your views here.
class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer


def landing(request):
    """Simple landing page."""
    return render(request, 'expenses/index.html', {})
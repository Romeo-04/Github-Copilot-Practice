from rest_framework.test import APITestCase
from .models import Expense


class ExpenseTestCase(APITestCase):
    def setUp(self):
        # create three expenses
        Expense.objects.create(name="Groceries", amount=50.00, description="Weekly groceries", category="Food")
        Expense.objects.create(name="Utilities", amount=100.00, description="Monthly utilities", category="Entertainment")
        Expense.objects.create(name="Transportation", amount=75.00, description="Gas and public transport", category="Transport")

    def test_expense_list(self):
        response = self.client.get('/expenses/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 3)

    def test_expense_details(self):
        expense = Expense.objects.first()
        response = self.client.get(f'/expenses/{expense.id}/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['name'], expense.name)
        # DRF serializes Decimal to string by default
        self.assertEqual(response.data['amount'], str(expense.amount))
        self.assertEqual(response.data['description'], expense.description)
        self.assertEqual(response.data['category'], expense.category)

    def test_expense_update(self):
        expense = Expense.objects.first()
        response = self.client.put(
            f'/expenses/{expense.id}/',
            {
                'name': 'Updated Expense',
                'amount': '150.00',
                'description': 'Updated description',
                'category': 'Food',
            },
            format='json',
        )
        self.assertEqual(response.status_code, 200)
        expense.refresh_from_db()
        self.assertEqual(expense.name, 'Updated Expense')
        self.assertEqual(str(expense.amount), '150.00')
        self.assertEqual(expense.description, 'Updated description')
        self.assertEqual(expense.category, 'Food')

    def test_expense_delete(self):
        expense = Expense.objects.first()
        response = self.client.delete(f'/expenses/{expense.id}/')
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Expense.objects.count(), 2)

    def tearDown(self):
        return super().tearDown()
    

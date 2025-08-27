document.addEventListener('DOMContentLoaded', () => {
  const API_BASE = '/api/expenses/';
  const listEl = document.getElementById('expenses-list');
  const formEl = document.getElementById('expense-form');
  const alertEl = document.getElementById('alert');

  function setAlert(msg, type = 'info') {
    if (!alertEl) return;
    alertEl.textContent = msg;
    alertEl.className = `alert ${type}`;
    alertEl.style.display = msg ? 'block' : 'none';
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  const csrftoken = getCookie('csrftoken');

  async function fetchExpenses() {
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error(`Failed to load (${res.status})`);
      const data = await res.json();
      renderList(data);
    } catch (err) {
      setAlert(err.message || 'Failed to load expenses', 'error');
    }
  }

  function renderList(items) {
    if (!Array.isArray(items)) return;
    if (!listEl) return;

    if (items.length === 0) {
      listEl.innerHTML = '<p>No expenses yet. Add one below.</p>';
      return;
    }

    const rows = items.map(x => `
      <tr>
        <td>${escapeHtml(x.name)}</td>
        <td>${escapeHtml(x.amount)}</td>
        <td>${escapeHtml(x.category)}</td>
        <td>${escapeHtml(x.description || '')}</td>
        <td>
          <button class="btn" data-action="delete" data-id="${x.id}">Delete</button>
        </td>
      </tr>
    `).join('');

    listEl.innerHTML = `
      <div class="card">
        <h3>Expenses</h3>
        <div style="overflow:auto">
          <table style="width:100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="text-align:left; padding:8px; border-bottom: 1px solid rgba(229,231,235,0.12);">Name</th>
                <th style="text-align:left; padding:8px; border-bottom: 1px solid rgba(229,231,235,0.12);">Amount</th>
                <th style="text-align:left; padding:8px; border-bottom: 1px solid rgba(229,231,235,0.12);">Category</th>
                <th style="text-align:left; padding:8px; border-bottom: 1px solid rgba(229,231,235,0.12);">Description</th>
                <th style="text-align:left; padding:8px; border-bottom: 1px solid rgba(229,231,235,0.12);"></th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  listEl?.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-action="delete"]');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    if (!id) return;

    try {
      const res = await fetch(`${API_BASE}${id}/`, {
        method: 'DELETE',
        headers: {
          'X-CSRFToken': csrftoken || '',
        },
      });
      if (![200, 204].includes(res.status)) throw new Error('Failed to delete');
      await fetchExpenses();
    } catch (err) {
      setAlert(err.message || 'Delete failed', 'error');
    }
  });

  formEl?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(formEl);
    const payload = {
      name: String(formData.get('name') || '').trim(),
      amount: String(formData.get('amount') || '').trim(),
      category: String(formData.get('category') || '').trim(),
      description: String(formData.get('description') || '').trim(),
    };

    if (!payload.name || !payload.amount || !payload.category) {
      setAlert('Name, amount, and category are required', 'error');
      return;
    }

    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken || '',
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to create expense');
      }
      formEl.reset();
      setAlert('Expense added', 'success');
      await fetchExpenses();
    } catch (err) {
      setAlert(err.message || 'Create failed', 'error');
    }
  });

  function escapeHtml(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  // initial load
  fetchExpenses();
});

// Admin panel page logic
import { renderNavbar } from '/src/js/navbar.js';
import { getCurrentProfile } from '/src/services/auth.js';
import { getAssignments, createAssignment, deleteAssignment } from '/src/services/assignments.js';
import { supabase } from '/src/services/supabase.js';
import { escapeHtml, formatDate, showAlert } from '/src/utils/helpers.js';

document.addEventListener('DOMContentLoaded', async () => {
  await renderNavbar();

  const { profile } = await getCurrentProfile();
  if (!profile) {
    window.location.href = '/src/pages/login.html';
    return;
  }

  // Проверка за admin достъп
  if (profile.role !== 'admin') {
    document.getElementById('access-denied').classList.remove('d-none');
    return;
  }

  document.getElementById('admin-content').classList.remove('d-none');

  // === Нова задача ===
  const assignForm = document.getElementById('assignment-form');
  assignForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('assign-title').value.trim();
    const description = document.getElementById('assign-desc').value.trim();
    const dueDate = document.getElementById('assign-due').value || null;

    const { error } = await createAssignment(
      { title, description, due_date: dueDate },
      profile.id
    );

    if (error) {
      showAlert('alert-container', 'Грешка: ' + error.message);
      return;
    }

    showAlert('alert-container', 'Задачата е публикувана успешно!', 'success');
    assignForm.reset();
    await loadAssignmentsTable();
  });

  // === Зареждаме задачите и потребителите ===
  await loadAssignmentsTable();
  await loadUsersTable();
});

/** Зарежда таблицата с задачите */
async function loadAssignmentsTable() {
  const tbody = document.getElementById('assignments-tbody');
  const container = document.getElementById('assignments-table-container');
  const loading = document.getElementById('manage-loading');

  const { data: assignments } = await getAssignments();
  loading.classList.add('d-none');
  container.classList.remove('d-none');

  if (!assignments || assignments.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="text-muted text-center">Няма задачи.</td></tr>';
    return;
  }

  tbody.innerHTML = assignments.map((a) => `
    <tr>
      <td>
        <a href="/src/pages/assignment.html?id=${a.id}">${escapeHtml(a.title)}</a>
      </td>
      <td>${formatDate(a.created_at)}</td>
      <td>${a.due_date ? formatDate(a.due_date) : '—'}</td>
      <td>
        <button class="btn btn-sm btn-outline-danger btn-delete-assignment" data-id="${a.id}">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');

  // Delete handlers
  tbody.querySelectorAll('.btn-delete-assignment').forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (!confirm('Сигурен ли си, че искаш да изтриеш тази задача?')) return;
      const { error } = await deleteAssignment(btn.dataset.id);
      if (error) {
        alert('Грешка: ' + error.message);
        return;
      }
      await loadAssignmentsTable();
    });
  });
}

/** Зарежда таблицата с потребителите */
async function loadUsersTable() {
  const tbody = document.getElementById('users-tbody');
  const container = document.getElementById('users-table-container');
  const loading = document.getElementById('users-loading');

  const { data: users, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: true });

  loading.classList.add('d-none');
  container.classList.remove('d-none');

  if (error || !users || users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" class="text-muted text-center">Няма потребители.</td></tr>';
    return;
  }

  tbody.innerHTML = users.map((u) => `
    <tr>
      <td>
        ${u.avatar_url ? `<img src="${u.avatar_url}" alt="Аватар на ${escapeHtml(u.full_name || 'потребител')}" class="avatar-sm me-2">` : ''}
        ${escapeHtml(u.full_name || 'Без име')}
      </td>
      <td>
        <span class="badge ${u.role === 'admin' ? 'bg-danger' : 'bg-primary'}">
          ${u.role === 'admin' ? 'Учител' : 'Ученик'}
        </span>
      </td>
      <td>${formatDate(u.created_at)}</td>
    </tr>
  `).join('');
}

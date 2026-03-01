// Assignments list page logic
import { renderNavbar } from '/src/js/navbar.js';
import { getCurrentProfile } from '/src/services/auth.js';
import { getAssignments } from '/src/services/assignments.js';
import { escapeHtml } from '/src/utils/helpers.js';

document.addEventListener('DOMContentLoaded', async () => {
  await renderNavbar();

  const { profile } = await getCurrentProfile();
  if (!profile) {
    window.location.href = '/src/pages/login.html';
    return;
  }

  const loading = document.getElementById('loading');
  const listEl = document.getElementById('assignments-list');
  const emptyState = document.getElementById('empty-state');
  const adminActions = document.getElementById('admin-actions');

  // Показваме бутон "Нова задача" само за admin
  if (profile.role === 'admin') {
    adminActions.innerHTML = `
      <a href="/src/pages/admin.html" class="btn btn-primary">
        <i class="bi bi-plus-lg me-1"></i>Нова задача
      </a>
    `;
  }

  // Зареждаме задачите
  const { data: assignments, error } = await getAssignments();

  loading.classList.add('d-none');

  if (error) {
    document.getElementById('alert-container').innerHTML = `
      <div class="alert alert-danger">Грешка при зареждане: ${error.message}</div>
    `;
    return;
  }

  if (!assignments || assignments.length === 0) {
    emptyState.classList.remove('d-none');
    return;
  }

  listEl.classList.remove('d-none');
  listEl.innerHTML = assignments.map((a) => `
    <div class="col-md-6 col-lg-4">
      <a href="/src/pages/assignment.html?id=${a.id}" class="text-decoration-none">
        <div class="card card-hover h-100">
          <div class="card-body">
            <h5 class="card-title text-dark">${escapeHtml(a.title)}</h5>
            <p class="card-text text-muted small">
              ${escapeHtml(a.description).substring(0, 120)}${a.description.length > 120 ? '...' : ''}
            </p>
          </div>
          <div class="card-footer bg-transparent d-flex justify-content-between">
            <small class="text-muted">
              <i class="bi bi-person me-1"></i>${escapeHtml(a.profiles?.full_name || 'Учител')}
            </small>
            <small class="text-muted">
              <i class="bi bi-calendar me-1"></i>${new Date(a.created_at).toLocaleDateString('bg-BG')}
            </small>
          </div>
          ${a.due_date ? `
            <div class="card-footer bg-transparent">
              <small class="text-danger">
                <i class="bi bi-alarm me-1"></i>Краен срок: ${new Date(a.due_date).toLocaleDateString('bg-BG')}
              </small>
            </div>
          ` : ''}
        </div>
      </a>
    </div>
  `).join('');
});

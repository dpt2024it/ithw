// Solution page — shows solution details + threaded comments
import { renderNavbar } from '/src/js/navbar.js';
import { getCurrentProfile } from '/src/services/auth.js';
import { getSolution } from '/src/services/solutions.js';
import { getCommentsBySolution, createComment, buildCommentTree } from '/src/services/comments.js';
import { escapeHtml, formatDate, getParam } from '/src/utils/helpers.js';

let currentProfile = null;

document.addEventListener('DOMContentLoaded', async () => {
  await renderNavbar();

  const { profile } = await getCurrentProfile();
  if (!profile) {
    window.location.href = '/src/pages/login.html';
    return;
  }
  currentProfile = profile;

  const solutionId = getParam('id');
  if (!solutionId) {
    window.location.href = '/src/pages/assignments.html';
    return;
  }

  const loading = document.getElementById('loading');
  const content = document.getElementById('content');

  // Зареждаме решението
  const { data: solution, error } = await getSolution(solutionId);
  loading.classList.add('d-none');

  if (error || !solution) {
    content.innerHTML = `<div class="alert alert-danger">Решението не е намерено.</div>`;
    content.classList.remove('d-none');
    return;
  }

  // Back link
  document.getElementById('back-link').href = `/src/pages/assignment.html?id=${solution.assignment_id}`;

  // Попълваме данните
  document.getElementById('solution-author').textContent = solution.profiles?.full_name || 'Ученик';
  document.getElementById('solution-assignment').textContent = `— ${solution.assignments?.title || ''}`;
  document.getElementById('solution-date').textContent = formatDate(solution.created_at);

  if (solution.code) {
    document.getElementById('solution-code').innerHTML = `<pre class="code-block">${escapeHtml(solution.code)}</pre>`;
  }

  if (solution.notes) {
    const notesEl = document.getElementById('solution-notes');
    notesEl.innerHTML = `<em>${escapeHtml(solution.notes)}</em>`;
    notesEl.classList.remove('d-none');
  }

  if (solution.file_url) {
    const fileEl = document.getElementById('solution-file');
    fileEl.innerHTML = `
      <a href="${solution.file_url}" target="_blank" class="btn btn-sm btn-outline-primary">
        <i class="bi bi-download me-1"></i>Прикачен файл
      </a>
    `;
    fileEl.classList.remove('d-none');
  }

  content.classList.remove('d-none');

  // Зареждаме коментарите
  await loadComments(solutionId);

  // Comment form
  const commentForm = document.getElementById('comment-form');
  commentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const body = document.getElementById('comment-body').value.trim();
    const parentId = document.getElementById('comment-parent-id').value || null;

    if (!body) return;

    const { error: commentErr } = await createComment(
      { solution_id: solutionId, body, parent_id: parentId },
      profile.id
    );

    if (commentErr) {
      alert('Грешка: ' + commentErr.message);
      return;
    }

    document.getElementById('comment-body').value = '';
    document.getElementById('comment-parent-id').value = '';
    document.getElementById('reply-indicator').classList.add('d-none');

    await loadComments(solutionId);
  });

  // Cancel reply
  document.getElementById('cancel-reply').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('comment-parent-id').value = '';
    document.getElementById('reply-indicator').classList.add('d-none');
  });
});

/** Зарежда и рендерира коментарите като дърво */
async function loadComments(solutionId) {
  const container = document.getElementById('comments-list');
  const { data: comments } = await getCommentsBySolution(solutionId);

  if (!comments || comments.length === 0) {
    container.innerHTML = '<p class="text-muted">Все още няма коментари.</p>';
    return;
  }

  const tree = buildCommentTree(comments);
  container.innerHTML = tree.map((c) => renderComment(c, 0)).join('');

  // Добавяме reply бутони
  container.querySelectorAll('.btn-reply').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const parentId = btn.dataset.id;
      const authorName = btn.dataset.author;
      document.getElementById('comment-parent-id').value = parentId;
      document.getElementById('reply-to-name').textContent = authorName;
      document.getElementById('reply-indicator').classList.remove('d-none');
      document.getElementById('comment-body').focus();
    });
  });
}

/** Рендерира един коментар (рекурсивно за replies) */
function renderComment(comment, depth) {
  const isReply = depth > 0;
  const html = `
    <div class="${isReply ? 'comment-reply' : ''} mb-3">
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <strong>${escapeHtml(comment.profiles?.full_name || 'Потребител')}</strong>
          <small class="text-muted ms-2">${formatDate(comment.created_at)}</small>
        </div>
        <a href="#" class="btn btn-sm btn-link btn-reply" data-id="${comment.id}"
           data-author="${escapeHtml(comment.profiles?.full_name || 'Потребител')}">
          <i class="bi bi-reply me-1"></i>Отговори
        </a>
      </div>
      <p class="mb-1 mt-1">${escapeHtml(comment.body)}</p>
      ${comment.replies.map((r) => renderComment(r, depth + 1)).join('')}
    </div>
  `;
  return html;
}

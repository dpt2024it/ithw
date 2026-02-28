// Discussion page — shows discussion thread with replies
import { renderNavbar } from '/src/js/navbar.js';
import { getCurrentProfile } from '/src/services/auth.js';
import { getDiscussionWithReplies, createReply } from '/src/services/discussions.js';
import { escapeHtml, formatDate, getParam } from '/src/utils/helpers.js';

document.addEventListener('DOMContentLoaded', async () => {
  await renderNavbar();

  const { profile } = await getCurrentProfile();
  if (!profile) {
    window.location.href = '/src/pages/login.html';
    return;
  }

  const discussionId = getParam('id');
  if (!discussionId) {
    window.location.href = '/src/pages/assignments.html';
    return;
  }

  const loading = document.getElementById('loading');
  const content = document.getElementById('content');

  // Зареждаме дискусията и отговорите
  const { discussion, replies, error } = await getDiscussionWithReplies(discussionId);
  loading.classList.add('d-none');

  if (error || !discussion) {
    content.innerHTML = `<div class="alert alert-danger">Дискусията не е намерена.</div>`;
    content.classList.remove('d-none');
    return;
  }

  // Back link
  document.getElementById('back-link').href = `/src/pages/assignment.html?id=${discussion.assignment_id}`;

  // Попълваме данните
  document.getElementById('disc-title').textContent = discussion.title;
  document.getElementById('disc-author').textContent = discussion.profiles?.full_name || 'Потребител';
  document.getElementById('disc-date').textContent = formatDate(discussion.created_at);
  document.getElementById('disc-body').innerHTML = escapeHtml(discussion.body).replace(/\n/g, '<br>');

  content.classList.remove('d-none');

  // Рендерираме отговорите
  renderReplies(replies);

  // Reply form
  const replyForm = document.getElementById('reply-form');
  replyForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const body = document.getElementById('reply-body').value.trim();
    if (!body) return;

    const { error: replyErr } = await createReply(
      { discussion_id: discussionId, body },
      profile.id
    );

    if (replyErr) {
      alert('Грешка: ' + replyErr.message);
      return;
    }

    document.getElementById('reply-body').value = '';

    // Презареждаме
    const { replies: updated } = await getDiscussionWithReplies(discussionId);
    renderReplies(updated);
  });
});

/** Рендерира списъка с отговори */
function renderReplies(replies) {
  const container = document.getElementById('replies-list');

  if (!replies || replies.length === 0) {
    container.innerHTML = '<p class="text-muted">Все още няма отговори.</p>';
    return;
  }

  container.innerHTML = replies.map((r) => `
    <div class="card mb-2">
      <div class="card-body py-2 px-3">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <strong>${escapeHtml(r.profiles?.full_name || 'Потребител')}</strong>
          <small class="text-muted">${formatDate(r.created_at)}</small>
        </div>
        <p class="mb-0">${escapeHtml(r.body).replace(/\n/g, '<br>')}</p>
      </div>
    </div>
  `).join('');
}

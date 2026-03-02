// Single assignment page — shows details, solutions and discussions
import { renderNavbar } from '/src/js/navbar.js';
import { getCurrentProfile } from '/src/services/auth.js';
import { getAssignment } from '/src/services/assignments.js';
import { getSolutionsByAssignment, createSolution, uploadSolutionFile } from '/src/services/solutions.js';
import { getDiscussionsByAssignment, createDiscussion } from '/src/services/discussions.js';
import { escapeHtml, formatDate, openFileUtf8 } from '/src/utils/helpers.js';

document.addEventListener('DOMContentLoaded', async () => {
  await renderNavbar();

  const { profile } = await getCurrentProfile();
  if (!profile) {
    window.location.href = '/src/pages/login.html';
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const assignmentId = params.get('id');
  if (!assignmentId) {
    window.location.href = '/src/pages/assignments.html';
    return;
  }

  const loading = document.getElementById('loading');
  const content = document.getElementById('content');

  // Зареждаме задачата
  const { data: assignment, error } = await getAssignment(assignmentId);
  loading.classList.add('d-none');

  if (error || !assignment) {
    content.innerHTML = `<div class="alert alert-danger">Задачата не е намерена.</div>`;
    content.classList.remove('d-none');
    return;
  }

  // Попълваме данните за задачата
  document.getElementById('assignment-title').textContent = assignment.title;
  document.getElementById('assignment-author').textContent = assignment.profiles?.full_name || 'Учител';
  document.getElementById('assignment-date').textContent = formatDate(assignment.created_at);
  document.getElementById('assignment-description').innerHTML = escapeHtml(assignment.description).replace(/\n/g, '<br>');

  if (assignment.due_date) {
    document.getElementById('assignment-due').classList.remove('d-none');
    document.getElementById('due-date').textContent = formatDate(assignment.due_date);
  }

  content.classList.remove('d-none');

  // Зареждаме решенията
  await loadSolutions(assignmentId, profile);

  // Зареждаме дискусиите
  await loadDiscussions(assignmentId);

  // Submit solution form
  const solutionForm = document.getElementById('solution-form');
  solutionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const code = document.getElementById('solution-code').value;
    const notes = document.getElementById('solution-notes').value;
    const fileInput = document.getElementById('solution-file');

    let fileUrl = null;
    if (fileInput.files.length > 0) {
      const { url, error: uploadErr } = await uploadSolutionFile(
        fileInput.files[0], profile.id, assignmentId
      );
      if (uploadErr) {
        alert('Грешка при качване на файл: ' + uploadErr.message);
        return;
      }
      fileUrl = url;
    }

    const { error: solErr } = await createSolution(
      { assignment_id: assignmentId, code, notes, file_url: fileUrl },
      profile.id
    );

    if (solErr) {
      alert('Грешка: ' + solErr.message);
      return;
    }

    solutionForm.reset();
    await loadSolutions(assignmentId, profile);
  });

  // Submit discussion form
  const discForm = document.getElementById('discussion-form');
  discForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('disc-title').value.trim();
    const body = document.getElementById('disc-body').value.trim();

    const { error: discErr } = await createDiscussion(
      { assignment_id: assignmentId, title, body },
      profile.id
    );

    if (discErr) {
      alert('Грешка: ' + discErr.message);
      return;
    }

    discForm.reset();
    await loadDiscussions(assignmentId);
  });
});

/** Зарежда и рендерира решенията */
async function loadSolutions(assignmentId, profile) {
  const container = document.getElementById('solutions-list');
  const { data: solutions } = await getSolutionsByAssignment(assignmentId);

  if (!solutions || solutions.length === 0) {
    container.innerHTML = '<p class="text-muted">Все още няма решения.</p>';
    return;
  }

  // Ако потребителят вече има решение, скриваме формата
  const hasSolution = solutions.some((s) => s.author_id === profile.id);
  if (hasSolution) {
    document.getElementById('submit-solution-card').classList.add('d-none');
  }

  const isOwn = (s) => s.author_id === profile.id;

  container.innerHTML = solutions.map((s) => {
    const own = isOwn(s);
    const bodyContent = `
        ${s.code ? `<pre class="code-block">${escapeHtml(s.code)}</pre>` : ''}
        ${s.notes ? `<p class="text-muted"><em>${escapeHtml(s.notes)}</em></p>` : ''}
        ${s.file_url ? `
          <button type="button" class="btn btn-sm btn-outline-primary open-file-btn" data-file-url="${s.file_url}">
            <i class="bi bi-download me-1"></i>Прикачен файл
          </button>
        ` : ''}`;

    return `
    <div class="card mb-3">
      <div class="card-header d-flex justify-content-between align-items-center">
        <div>
          <i class="bi bi-person-circle me-1"></i>
          <strong>${escapeHtml(s.profiles?.full_name || 'Ученик')}</strong>
          ${own ? '<span class="badge bg-primary ms-2">Моето</span>' : ''}
        </div>
        <small class="text-muted">${formatDate(s.created_at)}</small>
      </div>
      ${own
        ? `<div class="card-body">${bodyContent}</div>`
        : `<div class="card-body">
            <button class="btn btn-outline-primary btn-sm toggle-solution-btn"
                    type="button" data-solution-id="${s.id}">
              <i class="bi bi-eye me-1"></i>Виж решението
            </button>
            <div class="solution-content mt-3 d-none" id="solution-body-${s.id}">
              ${bodyContent}
            </div>
          </div>`
      }
      <div class="card-footer">
        <a href="/src/pages/solution.html?id=${s.id}" class="btn btn-sm btn-outline-secondary">
          <i class="bi bi-chat-dots me-1"></i>Коментари
        </a>
      </div>
    </div>`;
  }).join('');

  // Добавяме toggle логика за бутоните „Виж решението"
  container.querySelectorAll('.toggle-solution-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.solutionId;
      const body = document.getElementById(`solution-body-${id}`);
      const isHidden = body.classList.contains('d-none');
      body.classList.toggle('d-none');
      btn.innerHTML = isHidden
        ? '<i class="bi bi-eye-slash me-1"></i>Скрий решението'
        : '<i class="bi bi-eye me-1"></i>Виж решението';
    });
  });

  // Отваряме прикачени файлове с правилен UTF-8 encoding
  container.querySelectorAll('.open-file-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      openFileUtf8(btn.dataset.fileUrl);
    });
  });
}

/** Зарежда и рендерира дискусиите */
async function loadDiscussions(assignmentId) {
  const container = document.getElementById('discussions-list');
  const { data: discussions } = await getDiscussionsByAssignment(assignmentId);

  if (!discussions || discussions.length === 0) {
    container.innerHTML = '<p class="text-muted">Все още няма дискусии. Бъди първият, който ще зададе въпрос!</p>';
    return;
  }

  container.innerHTML = discussions.map((d) => `
    <div class="discussion-item mb-3 p-3 bg-white rounded shadow-sm">
      <a href="/src/pages/discussions.html?id=${d.id}" class="text-decoration-none">
        <h6 class="mb-1 text-dark">${escapeHtml(d.title)}</h6>
      </a>
      <div class="d-flex gap-3">
        <small class="text-muted">
          <i class="bi bi-person me-1"></i>${escapeHtml(d.profiles?.full_name || 'Потребител')}
        </small>
        <small class="text-muted">
          <i class="bi bi-calendar me-1"></i>${formatDate(d.created_at)}
        </small>
      </div>
    </div>
  `).join('');
}

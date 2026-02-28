// Utility functions — shared across the app

/**
 * Escape HTML за предотвратяване на XSS
 * @param {string} text
 * @returns {string}
 */
export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

/**
 * Форматира дата на български
 * @param {string} dateStr
 * @returns {string}
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('bg-BG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Взема query parameter от URL
 * @param {string} name
 * @returns {string | null}
 */
export function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

/**
 * Показва alert в контейнер
 * @param {string} containerId
 * @param {string} message
 * @param {'danger'|'success'|'warning'|'info'} type
 */
export function showAlert(containerId, message, type = 'danger') {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
  }
}

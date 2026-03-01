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
 * Формат: "нд 01 март 2026 г. 17:14:37"
 * @param {string} dateStr
 * @returns {string}
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const days = ['нд', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
  const months = ['ян', 'фев', 'март', 'ап', 'май', 'юни', 'юли', 'авг', 'сеп', 'окт', 'ноем', 'дек'];
  const dayOfWeek = days[d.getDay()];
  const date = String(d.getDate()).padStart(2, '0');
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${dayOfWeek} ${date} ${month} ${year} г. ${hours}:${minutes}:${seconds}`;
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
    container.setAttribute('role', 'alert');
    container.setAttribute('aria-live', 'polite');
    container.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
  }
}

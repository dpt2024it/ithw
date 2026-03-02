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

/**
 * Отваря файл от URL с правилен UTF-8 encoding.
 * Решава проблема с "маймуняци" (кирилица) при файлове в Supabase Storage,
 * които са качени без charset=utf-8 в Content-Type хедъра.
 * @param {string} url — публичен URL на файла
 * @param {string} [filename] — име на файла (за определяне на MIME типа)
 */
export async function openFileUtf8(url, filename = '') {
  const ext = (filename || url).split('.').pop().toLowerCase();

  // Само за текстови файлове правим UTF-8 fetch; за останалите — директен линк
  const textExtensions = {
    html: 'text/html',
    htm: 'text/html',
    css: 'text/css',
    js: 'text/javascript',
    json: 'application/json',
    txt: 'text/plain',
    xml: 'text/xml',
    svg: 'image/svg+xml',
    md: 'text/markdown',
  };

  const mimeType = textExtensions[ext];
  if (!mimeType) {
    // Не е текстов файл — отваряме директно
    window.open(url, '_blank');
    return;
  }

  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: `${mimeType}; charset=utf-8` });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
  } catch (err) {
    console.error('Грешка при отваряне на файла:', err);
    // Fallback — отваряме директно
    window.open(url, '_blank');
  }
}

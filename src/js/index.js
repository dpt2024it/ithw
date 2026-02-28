// Landing page logic
import { renderNavbar } from './navbar.js';
import { getCurrentUser } from '/src/services/auth.js';

document.addEventListener('DOMContentLoaded', async () => {
  await renderNavbar();

  // Ако потребителят вече е логнат, пренасочваме към assignments
  const user = await getCurrentUser();
  if (user) {
    window.location.href = '/src/pages/assignments.html';
  }
});

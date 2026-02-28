// Login page logic
import { renderNavbar } from '/src/js/navbar.js';
import { signIn } from '/src/services/auth.js';

document.addEventListener('DOMContentLoaded', async () => {
  await renderNavbar();

  const form = document.getElementById('login-form');
  const alertContainer = document.getElementById('alert-container');
  const spinner = document.getElementById('spinner');
  const btnLogin = document.getElementById('btn-login');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    alertContainer.innerHTML = '';
    spinner.classList.remove('d-none');
    btnLogin.disabled = true;

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    const { error } = await signIn(email, password);

    spinner.classList.add('d-none');
    btnLogin.disabled = false;

    if (error) {
      alertContainer.innerHTML = `
        <div class="alert alert-danger">${error.message}</div>
      `;
      return;
    }

    // Успешен вход — пренасочваме към задачите
    window.location.href = '/src/pages/assignments.html';
  });
});

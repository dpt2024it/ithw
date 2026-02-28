// Register page logic
import { renderNavbar } from '/src/js/navbar.js';
import { signUp } from '/src/services/auth.js';

document.addEventListener('DOMContentLoaded', async () => {
  await renderNavbar();

  const form = document.getElementById('register-form');
  const alertContainer = document.getElementById('alert-container');
  const spinner = document.getElementById('spinner');
  const btnRegister = document.getElementById('btn-register');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    alertContainer.innerHTML = '';

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Валидация
    if (password !== confirmPassword) {
      alertContainer.innerHTML = `
        <div class="alert alert-danger">Паролите не съвпадат!</div>
      `;
      return;
    }

    spinner.classList.remove('d-none');
    btnRegister.disabled = true;

    const { error } = await signUp(email, password, fullName);

    spinner.classList.add('d-none');
    btnRegister.disabled = false;

    if (error) {
      alertContainer.innerHTML = `
        <div class="alert alert-danger">${error.message}</div>
      `;
      return;
    }

    alertContainer.innerHTML = `
      <div class="alert alert-success">
        Регистрацията е успешна! Провери email-а си за потвърждение.
      </div>
    `;
    form.reset();
  });
});

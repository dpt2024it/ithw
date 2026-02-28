// Navbar component — generates the shared navigation bar
import { getCurrentProfile, signOut, onAuthStateChange } from '/src/services/auth.js';

/**
 * Рендерира навигационната лента.
 * Извиква се от всяка страница при зареждане.
 */
export async function renderNavbar() {
  const container = document.getElementById('navbar');
  if (!container) return;

  const { profile } = await getCurrentProfile();
  const isLoggedIn = !!profile;
  const isAdmin = profile?.role === 'admin';

  container.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand fw-bold" href="/">
          <i class="bi bi-code-slash me-2"></i>IT Homework
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarNav" aria-controls="navbarNav"
                aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            ${isLoggedIn ? `
              <li class="nav-item">
                <a class="nav-link" href="/src/pages/assignments.html">
                  <i class="bi bi-list-task me-1"></i>Задачи
                </a>
              </li>
            ` : ''}
            ${isAdmin ? `
              <li class="nav-item">
                <a class="nav-link" href="/src/pages/admin.html">
                  <i class="bi bi-gear me-1"></i>Admin
                </a>
              </li>
            ` : ''}
          </ul>
          <ul class="navbar-nav">
            ${isLoggedIn ? `
              <li class="nav-item">
                <a class="nav-link" href="/src/pages/profile.html">
                  <i class="bi bi-person-circle me-1"></i>${profile.full_name || 'Профил'}
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" id="btn-logout">
                  <i class="bi bi-box-arrow-right me-1"></i>Изход
                </a>
              </li>
            ` : `
              <li class="nav-item">
                <a class="nav-link" href="/src/pages/login.html">Вход</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/src/pages/register.html">Регистрация</a>
              </li>
            `}
          </ul>
        </div>
      </div>
    </nav>
  `;

  // Logout handler
  const logoutBtn = document.getElementById('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await signOut();
      window.location.href = '/';
    });
  }
}

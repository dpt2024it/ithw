// Profile page logic
import { renderNavbar } from '/src/js/navbar.js';
import { getCurrentProfile, getCurrentUser } from '/src/services/auth.js';
import { supabase } from '/src/services/supabase.js';
import { showAlert } from '/src/utils/helpers.js';

document.addEventListener('DOMContentLoaded', async () => {
  await renderNavbar();

  const user = await getCurrentUser();
  if (!user) {
    window.location.href = '/src/pages/login.html';
    return;
  }

  const { profile } = await getCurrentProfile();
  if (!profile) return;

  // Попълваме полетата
  document.getElementById('fullName').value = profile.full_name || '';
  document.getElementById('email').value = user.email || '';
  document.getElementById('role').value = profile.role === 'admin' ? 'Учител (admin)' : 'Ученик';

  // Аватар
  if (profile.avatar_url) {
    const img = document.getElementById('avatar-preview');
    img.src = profile.avatar_url;
    img.classList.remove('d-none');
    document.getElementById('avatar-placeholder').classList.add('d-none');
  }

  // Save form
  const form = document.getElementById('profile-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const fileInput = document.getElementById('avatar');
    let avatarUrl = profile.avatar_url;

    // Качваме аватар ако е избран нов файл
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const filePath = `${user.id}/avatar.${file.name.split('.').pop()}`;

      const { error: uploadErr } = await supabase.storage
        .from('solution-files')
        .upload(filePath, file, { upsert: true });

      if (uploadErr) {
        showAlert('alert-container', 'Грешка при качване на снимка: ' + uploadErr.message);
        return;
      }

      const { data } = supabase.storage
        .from('solution-files')
        .getPublicUrl(filePath);

      avatarUrl = data.publicUrl;
    }

    // Обновяваме профила
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, avatar_url: avatarUrl })
      .eq('id', user.id);

    if (error) {
      showAlert('alert-container', 'Грешка: ' + error.message);
      return;
    }

    showAlert('alert-container', 'Профилът е обновен успешно!', 'success');

    // Обновяваме аватара
    if (avatarUrl) {
      const img = document.getElementById('avatar-preview');
      img.src = avatarUrl;
      img.classList.remove('d-none');
      document.getElementById('avatar-placeholder').classList.add('d-none');
    }
  });
});

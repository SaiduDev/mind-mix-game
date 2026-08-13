/**
 * Profile Page - User data display and logout
 */

const Profile = (() => {
  function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.setAttribute('aria-pressed', savedTheme === 'dark');
      toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        toggle.setAttribute('aria-pressed', next === 'dark');
      });
    }
  }

  function getInitials(name) {
    if (!name) return '?';
    return name.split(' ').map((part) => part[0]).join('').toUpperCase().slice(0, 2);
  }

  function setField(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value ?? '—';
  }

  async function loadProfile() {
    const loadingEl = document.getElementById('profile-loading');
    const contentEl = document.getElementById('profile-content');
    const errorEl = document.getElementById('profile-error');

    try {
      const profile = await API.getProfile();
      const name = profile.name || 'Unknown';
      const avatarEl = document.getElementById('profile-avatar');
      if (avatarEl) avatarEl.textContent = getInitials(name);

      setField('profile-name', name);
      setField('profile-username', `@${profile.username || '—'}`);
      setField('profile-email', profile.email || '—');
      setField('profile-level', profile.currentLevel ?? localStorage.getItem('currentLevel') ?? '1');
      setField('profile-score', Number(profile.totalScore ?? localStorage.getItem('totalScore') ?? 0).toLocaleString());
      setField('profile-completed', profile.levelsCompleted ?? localStorage.getItem('levelsCompleted') ?? '0');

      if (loadingEl) loadingEl.hidden = true;
      if (contentEl) contentEl.hidden = false;
    } catch (error) {
      if (loadingEl) loadingEl.hidden = true;
      if (errorEl) { errorEl.hidden = false; errorEl.textContent = error.message; }
    }
  }

  function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        API.clearToken();
        window.location.href = 'index.html';
      });
    }
  }

  function init() {
    if (!API.requireAuth()) return;
    initTheme();
    loadProfile();
    setupLogout();
    document.querySelectorAll('.bottom-nav__item').forEach((item) => {
      if (item.dataset.page === 'profile') item.classList.add('active');
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();

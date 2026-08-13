/**
 * Dashboard - Stats, continue game, level preview
 */

const Dashboard = (() => {
  const TOTAL_LEVELS = 210;
  const STORAGE_KEYS = {
    currentLevel: 'currentLevel',
    totalScore: 'totalScore',
    levelsCompleted: 'levelsCompleted',
    completedLevels: 'completedLevels',
  };

  function getProgress() {
    return {
      currentLevel: parseInt(localStorage.getItem(STORAGE_KEYS.currentLevel) || '1', 10),
      totalScore: parseInt(localStorage.getItem(STORAGE_KEYS.totalScore) || '0', 10),
      levelsCompleted: parseInt(localStorage.getItem(STORAGE_KEYS.levelsCompleted) || '0', 10),
      completedLevels: JSON.parse(localStorage.getItem(STORAGE_KEYS.completedLevels) || '[]'),
    };
  }

  function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'toastOut 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

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

  async function loadUserData() {
    const greetingEl = document.getElementById('user-greeting');
    const loadingEl = document.getElementById('dashboard-loading');
    const contentEl = document.getElementById('dashboard-content');

    try {
      const profile = await API.getProfile();
      const name = profile.name || profile.username || 'Player';
      if (greetingEl) {
        greetingEl.textContent = `Welcome back, ${name}!`;
      }

      // Sync server stats if available
      if (profile.currentLevel) {
        localStorage.setItem(STORAGE_KEYS.currentLevel, profile.currentLevel);
      }
      if (profile.totalScore !== undefined) {
        localStorage.setItem(STORAGE_KEYS.totalScore, profile.totalScore);
      }
      if (profile.levelsCompleted !== undefined) {
        localStorage.setItem(STORAGE_KEYS.levelsCompleted, profile.levelsCompleted);
      }
    } catch {
      if (greetingEl) greetingEl.textContent = 'Welcome back, Player!';
    } finally {
      if (loadingEl) loadingEl.hidden = true;
      if (contentEl) contentEl.hidden = false;
    }
  }

  function renderStats() {
    const progress = getProgress();
    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };

    setText('stat-level', progress.currentLevel);
    setText('stat-score', progress.totalScore.toLocaleString());
    setText('stat-completed', progress.levelsCompleted);
    setText('stat-total', TOTAL_LEVELS);

    const percent = Math.round((progress.levelsCompleted / TOTAL_LEVELS) * 100);
    setText('progress-percent', `${percent}%`);
    const fill = document.getElementById('progress-fill');
    if (fill) fill.style.width = `${percent}%`;
    setText('progress-completed', `${progress.levelsCompleted} completed`);
    setText('progress-remaining', `${TOTAL_LEVELS - progress.levelsCompleted} remaining`);
  }

  function renderLevelPreview() {
    const progress = getProgress();
    const grid = document.getElementById('level-preview-grid');
    if (!grid) return;

    const start = Math.max(1, progress.currentLevel - 5);
    const end = Math.min(TOTAL_LEVELS, start + 19);

    grid.innerHTML = '';
    for (let i = start; i <= end; i++) {
      const item = document.createElement('div');
      item.className = 'level-preview__item';
      item.textContent = i;

      if (progress.completedLevels.includes(i)) {
        item.classList.add('level-preview__item--completed');
      }
      if (i === progress.currentLevel) {
        item.classList.add('level-preview__item--current');
      }
      grid.appendChild(item);
    }
  }

  function setupActions() {
    const progress = getProgress();
    const continueCard = document.getElementById('continue-game');
    const continueLevel = document.getElementById('continue-level');

    if (continueCard) {
      continueCard.hidden = false;
      if (continueLevel) continueLevel.textContent = `Level ${progress.currentLevel}`;
      continueCard.href = `game.html?level=${progress.currentLevel}`;
    }

    const playNew = document.getElementById('play-new');
    if (playNew) {
      playNew.href = 'game.html';
    }
  }

  function init() {
    if (!API.requireAuth()) return;

    initTheme();
    loadUserData();
    renderStats();
    renderLevelPreview();
    setupActions();

    // Highlight active nav
    document.querySelectorAll('.bottom-nav__item').forEach((item) => {
      if (item.dataset.page === 'dashboard') item.classList.add('active');
    });
  }

  document.addEventListener('DOMContentLoaded', init);

  return { getProgress, showToast, TOTAL_LEVELS };
})();

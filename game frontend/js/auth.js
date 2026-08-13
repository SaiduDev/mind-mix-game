/**
 * Authentication - Form validation and auth page handlers
 */

const Auth = (() => {
  /** Display error message in form */
  function showError(form, message) {
    let errorEl = form.querySelector('.form-error');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'form-error';
      form.insertBefore(errorEl, form.firstChild);
    }
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  /** Clear error message */
  function clearError(form) {
    const errorEl = form.querySelector('.form-error');
    if (errorEl) {
      errorEl.hidden = true;
      errorEl.textContent = '';
    }
  }

  /** Validate email format */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /** Validate username (3-20 alphanumeric + underscore) */
  function isValidUsername(username) {
    return /^[a-zA-Z0-9_]{3,20}$/.test(username);
  }

  /** Set button loading state */
  function setLoading(button, loading) {
    if (loading) {
      button.dataset.originalText = button.textContent;
      button.textContent = 'Please wait...';
      button.disabled = true;
      button.classList.add('loading');
    } else {
      button.textContent = button.dataset.originalText || button.textContent;
      button.disabled = false;
      button.classList.remove('loading');
    }
  }

  /** Initialize theme toggle on auth pages */
  function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    toggle.setAttribute('aria-pressed', savedTheme === 'dark');

    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      toggle.setAttribute('aria-pressed', next === 'dark');
    });
  }

  /** Handle Sign Up form submission */
  function initSignUp() {
    if (API.redirectIfAuthenticated()) return;

    const form = document.getElementById('signup-form');
    if (!form) return;

    initThemeToggle();

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearError(form);

      const name = form.name.value.trim();
      const username = form.username.value.trim();
      const email = form.email.value.trim();
      const password = form.password.value;
      const confirmPassword = form.confirmPassword.value;
      const remember = form.remember?.checked ?? true;

      if (!name || name.length < 2) {
        showError(form, 'Name must be at least 2 characters.');
        return;
      }
      if (!isValidUsername(username)) {
        showError(form, 'Username must be 3-20 characters (letters, numbers, underscore).');
        return;
      }
      if (!isValidEmail(email)) {
        showError(form, 'Please enter a valid email address.');
        return;
      }
      if (password.length < 6) {
        showError(form, 'Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        showError(form, 'Passwords do not match.');
        return;
      }

      const submitBtn = form.querySelector('[type="submit"]');
      setLoading(submitBtn, true);

      try {
        const data = await API.signup({ name, username, email, password });
        const token = data.token || data.accessToken || data.access_token;
        if (token) {
          API.setToken(token, remember);
        }
        window.location.href = 'dashboard.html';
      } catch (error) {
        showError(form, error.message);
      } finally {
        setLoading(submitBtn, false);
      }
    });
  }

  /** Handle Sign In form submission */
  function initSignIn() {
    if (API.redirectIfAuthenticated()) return;

    const form = document.getElementById('signin-form');
    if (!form) return;

    initThemeToggle();

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearError(form);

      const email = form.email.value.trim();
      const password = form.password.value;
      const remember = form.remember?.checked ?? true;

      if (!email) {
        showError(form, 'Please enter your email or username.');
        return;
      }
      if (!password) {
        showError(form, 'Please enter your password.');
        return;
      }

      const submitBtn = form.querySelector('[type="submit"]');
      setLoading(submitBtn, true);

      try {
        const data = await API.signin({ email, password });
        const token = data.token || data.accessToken || data.access_token;
        if (token) {
          API.setToken(token, remember);
        }
        window.location.href = 'dashboard.html';
      } catch (error) {
        showError(form, error.message);
      } finally {
        setLoading(submitBtn, false);
      }
    });
  }

  /** Initialize landing page */
  function initLanding() {
    initThemeToggle();
    if (API.isAuthenticated()) {
      const continueBtn = document.getElementById('hero-continue');
      if (continueBtn) continueBtn.hidden = false;
    }
  }

  return {
    initSignUp,
    initSignIn,
    initLanding,
    initThemeToggle,
  };
})();

/**
 * API Client - Centralized HTTP layer for backend communication
 */

const API = (() => {
  // Configure your backend base URL here
  const BASE_URL = window.API_BASE_URL || 'http://localhost:3000/api';

  const TOKEN_KEY = 'authToken';

  /** Retrieve stored auth token */
  function getToken() {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  }

  /** Persist auth token */
  function setToken(token, remember = true) {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    if (remember) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
    }
  }

  /** Clear auth token on logout */
  function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  }

  /** Check if user is authenticated */
  function isAuthenticated() {
    return !!getToken();
  }

  /** Redirect to signin if not authenticated */
  function requireAuth(redirectUrl = 'signin.html') {
    if (!isAuthenticated()) {
      window.location.href = redirectUrl;
      return false;
    }
    return true;
  }

  /** Redirect to dashboard if already authenticated */
  function redirectIfAuthenticated(redirectUrl = 'dashboard.html') {
    if (isAuthenticated()) {
      window.location.href = redirectUrl;
      return true;
    }
    return false;
  }

  /**
   * Generic fetch wrapper with error handling
   */
  async function request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      let data = null;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = text ? { message: text } : null;
      }

      if (!response.ok) {
        const message =
          data?.message ||
          data?.error ||
          `Request failed with status ${response.status}`;
        throw new Error(message);
      }

      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check your connection.');
      }
      throw error;
    }
  }

  /** POST /signup */
  async function signup({ name, username, email, password }) {
    return request('/signup', {
      method: 'POST',
      body: JSON.stringify({ name, username, email, password }),
    });
  }

  /** POST /signin */
  async function signin({ email, password }) {
    return request('/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  /** GET /profile */
  async function getProfile() {
    return request('/profile', { method: 'GET' });
  }

  return {
    getToken,
    setToken,
    clearToken,
    isAuthenticated,
    requireAuth,
    redirectIfAuthenticated,
    signup,
    signin,
    getProfile,
  };
})();

const AUTH_TOKEN_KEY = 'gpe_admin_auth_token';
const AUTH_USER_KEY = 'gpe_admin_auth_user';

class AuthManager {
  constructor() {
    this.currentUser = this.loadUser();
    this.isAuthenticated = !!localStorage.getItem(AUTH_TOKEN_KEY);
    this.subscribers = new Set();
  }

  loadUser() {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return {
      name: 'Dr. Elena Vance',
      email: 'admin@greenpulse.energy',
      role: 'Chief Administrator & Clean Tech Lead',
      avatar: '/images/team-ceo.jpg'
    };
  }

  login(email, password, remember = true) {
    // Standard verification with demo credentials helper
    if (
      (email.toLowerCase() === 'admin@greenpulse.energy' && password === 'GreenPulse2026!') ||
      (email.toLowerCase() === 'admin' && password === 'admin') ||
      (email.includes('@') && password.length >= 6)
    ) {
      const token = 'gpe_jwt_' + Math.random().toString(36).substring(2) + Date.now();
      const user = {
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        email: email,
        role: 'Administrator',
        avatar: '/images/team-ceo.jpg',
        lastLogin: new Date().toISOString()
      };

      if (remember) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      } else {
        sessionStorage.setItem(AUTH_TOKEN_KEY, token);
        sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      }

      this.currentUser = user;
      this.isAuthenticated = true;
      this.notify();
      return { success: true, user };
    }

    return {
      success: false,
      message: 'Invalid credentials. You can use admin@greenpulse.energy / GreenPulse2026!'
    };
  }

  logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_USER_KEY);
    this.isAuthenticated = false;
    this.currentUser = null;
    this.notify();
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify() {
    this.subscribers.forEach((cb) => cb(this.isAuthenticated, this.currentUser));
  }
}

export const authManager = new AuthManager();

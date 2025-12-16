import { Dashboard } from './controllers/Dashboard.js';

function boot() {
  const dashboard = new Dashboard();
  dashboard.init().catch(err => console.error('Dashboard init failed:', err));
  window.dashboard = dashboard; // optional global
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

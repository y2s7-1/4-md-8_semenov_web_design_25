const KEY = 'dashboard.widgets.v2';
export class StorageService {
  static load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  }
  static save(widgets) {
    try { localStorage.setItem(KEY, JSON.stringify(widgets)); } catch {}
  }
}

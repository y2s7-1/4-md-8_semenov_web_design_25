export class NotificationService {
  static async ensurePermission() {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    try {
      const res = await Notification.requestPermission();
      return res === 'granted';
    } catch { return false; }
  }
  static notify(title, body) {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  }
}

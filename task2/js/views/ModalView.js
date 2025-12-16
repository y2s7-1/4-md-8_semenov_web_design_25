import { $, $$ } from '../utils/dom.js';

export class ModalView {
  static open(target) {
    const el = typeof target === 'string' ? $(target) : target;
    if (!el) { console.warn('ModalView.open: target not found', target); return; }
    el.style.display = 'block';
  }
  static closeAll() { $$('.modal').forEach(m => m.style.display = 'none'); }
  static bindClose() {
    $$('.modal .close,[data-close]').forEach(btn => btn.addEventListener('click', () => ModalView.closeAll()));
    window.addEventListener('click', (e)=>{ if (e.target.classList.contains('modal')) ModalView.closeAll(); });
  }
}

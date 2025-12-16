import { Widget } from './Widget.js';

export class NotesWidget extends Widget {
  render(contentEl) {
    contentEl.innerHTML = `
      <div class="notes-widget">
        <textarea class="notes-area" placeholder="Type your notes here...">${this.config.text||''}</textarea>
      </div>`;
    const ta = contentEl.querySelector('.notes-area');
    ta.addEventListener('input', () => { this.config.text = ta.value; document.dispatchEvent(new CustomEvent('widget:changed')); });
  }
  configForm(container) {
    container.innerHTML = `<p>No settings for Notes.</p>`;
  }
}

import { createEl } from '../utils/dom.js';

export class WidgetView {
  constructor(widget) { this.widget = widget; }
  build() {
    const w = this.widget;
    const el = createEl('div', { className: 'widget', draggable: true });
    el.dataset.id = w.id;
    el.innerHTML = `
      <div class="widget-header">
        <h3 class="widget-title">${w.title}</h3>
        <div class="widget-controls">
          <button class="widget-btn" data-action="config" title="Configure"><i class="fas fa-cog"></i></button>
          <button class="widget-btn" data-action="remove" title="Remove"><i class="fas fa-times"></i></button>
        </div>
      </div>
      <div class="widget-content"></div>
    `;
    return el;
  }
}

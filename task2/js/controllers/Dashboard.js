import { $, $$, createEl } from '../utils/dom.js';
import { uid } from '../utils/id.js';
import { StorageService } from '../services/StorageService.js';
import { NotificationService } from '../services/NotificationService.js';
import { ModalView } from '../views/ModalView.js';
import { WidgetView } from '../views/WidgetView.js';

import { Widget } from '../models/Widget.js';
import { WeatherWidget } from '../models/WeatherWidget.js';
import { ExchangeWidget } from '../models/ExchangeWidget.js';
import { StocksWidget } from '../models/StocksWidget.js';
import { TimerWidget } from '../models/TimerWidget.js';
import { NotesWidget } from '../models/NotesWidget.js';

const WIDGET_TYPES = {
  weather: WeatherWidget,
  exchange: ExchangeWidget,
  stocks: StocksWidget,
  timer: TimerWidget,
  notes: NotesWidget
};

export class Dashboard {
  constructor() {
    this.widgets = [];
    this.dragged = null;
  }

  async init() {
    ModalView.bindClose();
    await NotificationService.ensurePermission();
    this.restore();
    this.bindUI();
    this.render();
  }

  bindUI() {
    const addBtn = $('#add-widget-btn'); if (addBtn) addBtn.addEventListener('click', ()=> ModalView.open('#add-widget-modal')); else console.warn('add-widget-btn not found');
    const clearBtn = $('#clear-widgets-btn'); if (clearBtn) clearBtn.addEventListener('click', ()=> this.clearAll()); else console.warn('clear-widgets-btn not found');
    $$('.widget-option').forEach(opt => {
      opt.addEventListener('click', ()=> {
        const type = opt.dataset.type;
        this.addWidget(type);
        ModalView.closeAll();
      });
    });
    document.addEventListener('widget:changed', ()=> this.persist());
  }

  factory(type) {
    const Cls = WIDGET_TYPES[type] || Widget;
    const id = uid('widget');
    return new Cls({ id, type, title: undefined, config: {} });
  }

  addWidget(type) {
    const widget = this.factory(type);
    this.widgets.push(widget);
    this.persist();
    this.render();
  }

  removeWidget(id) {
    this.widgets = this.widgets.filter(w => w.id !== id);
    this.persist();
    this.render();
  }

  clearAll() {
    if (!confirm('Remove all widgets?')) return;
    this.widgets = [];
    this.persist();
    this.render();
  }

  persist() {
    StorageService.save(this.widgets.map(w => w.toJSON()));
    this.updateEmptyState();
  }

  restore() {
    const saved = StorageService.load();
    this.widgets = saved.map(obj => {
      const Cls = WIDGET_TYPES[obj.type] || Widget;
      return new Cls(obj);
    });
    this.updateEmptyState();
  }

  updateEmptyState() {
    $('#empty-state').style.display = this.widgets.length ? 'none' : 'block';
  }

  render() {
    const grid = $('#widgets-grid');
    grid.innerHTML = '';
    this.widgets.forEach(widget => {
      const view = new WidgetView(widget);
      const el = view.build();
      // Bind buttons
      el.querySelector('[data-action="remove"]').addEventListener('click', ()=> this.removeWidget(widget.id));
      el.querySelector('[data-action="config"]').addEventListener('click', ()=> this.openConfig(widget));
      // Drag & drop
      el.addEventListener('dragstart', ()=> this.dragged = el);
      el.addEventListener('dragend', ()=> this.dragged = null);
      el.addEventListener('dragover', (e)=>{
        e.preventDefault();
        const target = e.currentTarget;
        if (this.dragged && target !== this.dragged) {
          const nodes = Array.from(grid.children);
          const draggedIdx = nodes.indexOf(this.dragged);
          const targetIdx = nodes.indexOf(target);
          if (draggedIdx < targetIdx) grid.insertBefore(this.dragged, target.nextSibling);
          else grid.insertBefore(this.dragged, target);
        }
      });
      // Render content
      const content = el.querySelector('.widget-content');
      if (typeof widget.render === 'function') widget.render(content);
      grid.appendChild(el);
    });
  }

  openConfig(widget) {
    const modal = $('#config-modal');
    $('#config-modal-title').textContent = `Configure: ${widget.title}`;
    const form = $('#config-form'); form.innerHTML='';
    if (typeof widget.configForm === 'function') widget.configForm(form);
    $('#config-save-btn').onclick = ()=> {
      if (typeof widget.readConfig === 'function') {
        widget.config = { ...widget.config, ...widget.readConfig(form) };
      }
      this.persist();
      this.render();
      modal.style.display = 'none';
    };
    modal.style.display = 'block';
  }
}

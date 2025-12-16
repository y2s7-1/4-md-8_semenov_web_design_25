(function(){
'use strict';
// ---- utils/dom.js ----
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
const createEl = (tag, props={}) => Object.assign(document.createElement(tag), props);


// ---- utils/id.js ----
let counter = 0;
function uid(prefix='w') {
  counter += 1;
  return `${prefix}-${Date.now()}-${counter}`;
}


// ---- services/StorageService.js ----
const KEY = 'dashboard.widgets.v2';
class StorageService {
  static load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  }
  static save(widgets) {
    try { localStorage.setItem(KEY, JSON.stringify(widgets)); } catch {}
  }
}


// ---- services/NotificationService.js ----
class NotificationService {
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


// ---- services/DataService.js ----
// Minimal data service; can be swapped for real APIs.
class DataService {
  static async weatherByCoords(lat, lon) {
    // Fallback to mock data to avoid API dependency here.
    // Replace with real fetch to Open-Meteo or similar if needed.
    return {
      city: 'Your Location',
      temperature: (Math.random()*15+5).toFixed(1),
      description: ['Clear','Cloudy','Rain','Windy'][Math.floor(Math.random()*4)],
      icon: 'fas fa-cloud-sun'
    };
  }
  static exchangeRates(targetCurrencies=['USD','EUR','GBP']) {
    const out = {};
    targetCurrencies.forEach(c=> { out[c] = (Math.random()*2+0.5).toFixed(4); });
    return out;
  }
  static stocks(symbols=['AAPL','GOOG','TSLA']) {
    return symbols.map(sym => ({
      symbol: sym,
      price: (Math.random()*900+100).toFixed(2),
      change: (Math.random()*4-2).toFixed(2)
    }));
  }
}


// ---- models/Widget.js ----
class Widget {
  constructor({id, type, title, config}) {
    this.id = id;
    this.type = type;
    this.title = title || type[0].toUpperCase()+type.slice(1);
    this.config = config || {};
  }
  toJSON() {
    return { id: this.id, type: this.type, title: this.title, config: this.config };
  }
}


// ---- models/WeatherWidget.js ----


class WeatherWidget extends Widget {
  async render(contentEl) {
    const setHTML = (data) => {
      contentEl.innerHTML = `
        <div class="weather-widget">
          <div class="weather-icon"><i class="${data.icon}"></i></div>
          <div class="weather-info">
            <div class="location">${data.city}</div>
            <div class="temperature">${data.temperature}°C</div>
            <div class="description">${data.description}</div>
          </div>
        </div>`;
    };
    try {
      if (navigator.geolocation) {
        await new Promise(resolve => navigator.geolocation.getCurrentPosition(resolve, resolve));
      }
      const data = await DataService.weatherByCoords(0,0);
      setHTML(data);
    } catch {
      setHTML({city:'Unknown', temperature:'--', description:'N/A', icon:'fas fa-cloud'});
    }
  }
  configForm(container) {
    container.innerHTML = `<label>Units (°C only in demo)</label>`;
  }
}


// ---- models/ExchangeWidget.js ----


class ExchangeWidget extends Widget {
  render(contentEl) {
    const currencies = this.config.targetCurrencies || ['USD','EUR','GBP'];
    const rates = DataService.exchangeRates(currencies);
    let html = '<div class="exchange-widget">';
    Object.entries(rates).forEach(([cur, rate]) => {
      const change = (Math.random()*4-2).toFixed(2);
      const cls = change >= 0 ? 'positive' : 'negative';
      html += `<div class="rate-row">
                 <span class="currency">${cur}</span>
                 <span class="rate">${rate}</span>
                 <span class="change ${cls}">${change}%</span>
               </div>`;
    });
    html += '</div>';
    contentEl.innerHTML = html;
  }
  configForm(container) {
    const value = (this.config.targetCurrencies || ['USD','EUR','GBP']).join(',');
    container.innerHTML = `
      <label for="currs">Currencies (comma-separated)</label>
      <input id="currs" type="text" value="${value}"/>`;
  }
  readConfig(container) {
    const v = container.querySelector('#currs').value.trim();
    return { targetCurrencies: v ? v.split(',').map(s=>s.trim().toUpperCase()) : ['USD','EUR','GBP'] };
  }
}


// ---- models/StocksWidget.js ----


class StocksWidget extends Widget {
  render(contentEl) {
    const symbols = this.config.symbols || ['AAPL','GOOG','TSLA'];
    const list = DataService.stocks(symbols);
    let html = '<div class="stocks-widget">';
    list.forEach(s => {
      const cls = s.change >= 0 ? 'positive' : 'negative';
      html += `<div class="stock-row">
                 <span class="symbol">${s.symbol}</span>
                 <span class="price">${s.price}</span>
                 <span class="change ${cls}">${s.change}%</span>
               </div>`;
    });
    html += '</div>';
    contentEl.innerHTML = html;
  }
  configForm(container) {
    const value = (this.config.symbols || ['AAPL','GOOG','TSLA']).join(',');
    container.innerHTML = `
      <label for="symbols">Symbols (comma-separated)</label>
      <input id="symbols" type="text" value="${value}"/>`;
  }
  readConfig(container) {
    const v = container.querySelector('#symbols').value.trim();
    return { symbols: v ? v.split(',').map(s=>s.trim().toUpperCase()) : ['AAPL','GOOG','TSLA'] };
  }
}


// ---- models/TimerWidget.js ----


class TimerWidget extends Widget {
  render(contentEl) {
    const duration = parseInt(this.config.seconds || 60, 10);
    contentEl.innerHTML = `
      <div class="timer-widget">
        <div class="timer-display" data-remaining="${duration}">${this.format(duration)}</div>
        <div class="timer-controls">
          <button class="btn btn-primary" data-action="start">Start</button>
          <button class="btn" data-action="pause">Pause</button>
          <button class="btn btn-danger" data-action="reset">Reset</button>
        </div>
      </div>`;
    let interval = null;
    const display = contentEl.querySelector('.timer-display');
    const start = () => {
      if (interval) return;
      interval = setInterval(()=>{
        let v = parseInt(display.dataset.remaining,10);
        v -= 1; display.dataset.remaining = v;
        display.textContent = this.format(v);
        if (v <= 0) {
          clearInterval(interval); interval = null;
          NotificationService.notify('Timer done','Time is up!');
        }
      },1000);
    };
    const pause = () => { if (interval){ clearInterval(interval); interval = null; } };
    const reset = () => { pause(); display.dataset.remaining = duration; display.textContent = this.format(duration); };
    contentEl.querySelector('[data-action="start"]').addEventListener('click', start);
    contentEl.querySelector('[data-action="pause"]').addEventListener('click', pause);
    contentEl.querySelector('[data-action="reset"]').addEventListener('click', reset);
  }
  format(s) {
    const m = Math.floor(s/60).toString().padStart(2,'0');
    const ss = Math.floor(s%60).toString().padStart(2,'0');
    return `${m}:${ss}`;
  }
  configForm(container) {
    const val = this.config.seconds || 60;
    container.innerHTML = `
      <label for="seconds">Seconds</label>
      <input id="seconds" type="number" min="1" value="${val}"/>`;
  }
  readConfig(container) {
    const v = parseInt(container.querySelector('#seconds').value,10);
    return { seconds: isNaN(v) ? 60 : Math.max(1, v) };
  }
}


// ---- models/NotesWidget.js ----

class NotesWidget extends Widget {
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


// ---- views/ModalView.js ----

class ModalView {
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


// ---- views/WidgetView.js ----

class WidgetView {
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


// ---- controllers/Dashboard.js ----











const WIDGET_TYPES = {
  weather: WeatherWidget,
  exchange: ExchangeWidget,
  stocks: StocksWidget,
  timer: TimerWidget,
  notes: NotesWidget
};

class Dashboard {
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


// ---- bootstrap (inside same scope) ----
  const dashboard = new Dashboard();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ()=>dashboard.init());
  } else {
    dashboard.init();
  }
  window.dashboard = dashboard;
})();
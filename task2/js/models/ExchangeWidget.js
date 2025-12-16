import { Widget } from './Widget.js';
import { DataService } from '../services/DataService.js';

export class ExchangeWidget extends Widget {
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

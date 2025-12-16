import { Widget } from './Widget.js';
import { DataService } from '../services/DataService.js';

export class StocksWidget extends Widget {
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

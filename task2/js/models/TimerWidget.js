import { Widget } from './Widget.js';
import { NotificationService } from '../services/NotificationService.js';

export class TimerWidget extends Widget {
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

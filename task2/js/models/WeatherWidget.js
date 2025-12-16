// js/models/WeatherWidget.js
import { Widget } from './Widget.js';
import { DataService } from '../services/DataService.js';

export class WeatherWidget extends Widget {
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

    contentEl.innerHTML = `<div class="weather-widget">Загружаю погоду…</div>`;

    try {
      const { lat, lon } = await this.getCoords();
      const data = await DataService.weatherByCoords(lat, lon);
      setHTML(data);
    } catch (e) {
      // Фоллбэк (например, Хельсинки)
      try {
        const data = await DataService.weatherByCoords(60.1699, 24.9384);
        setHTML(data);
      } catch {
        setHTML({ city:'Неизвестно', temperature:'--', description:'Ошибка', icon:'fas fa-cloud' });
      }
    }
  }

  getCoords() {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) return reject(new Error('Geolocation unsupported'));
      navigator.geolocation.getCurrentPosition(
        pos => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        err => reject(err),
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 }
      );
    });
  }

  configForm(container) {
    container.innerHTML = `<p>Погода определяется автоматически по геолокации браузера.</p>`;
  }
}

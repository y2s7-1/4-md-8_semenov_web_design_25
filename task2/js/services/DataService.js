// js/services/DataService.js
export class DataService {
  // ВСТАВЬ СВОЙ КЛЮЧ OWM (у тебя уже есть)
  static OPENWEATHER_KEY = '9a2878252b5d08bd08a04ff56e93efd3';

  static async weatherByCoords(lat, lon) {
    // 1) валидация координат
    const la = Number(lat), lo = Number(lon);
    if (!Number.isFinite(la) || !Number.isFinite(lo)) {
      console.warn('DataService.weatherByCoords: invalid coords', lat, lon);
      return DataService._fallbackOpenMeteo(59.9343, 30.3351); // СПб как дефолт
    }

    try {
      // 2) основной запрос к OpenWeatherMap
      const wUrl = new URL('https://api.openweathermap.org/data/2.5/weather');
      wUrl.searchParams.set('lat', la);
      wUrl.searchParams.set('lon', lo);
      wUrl.searchParams.set('appid', this.OPENWEATHER_KEY);
      wUrl.searchParams.set('units', 'metric');
      wUrl.searchParams.set('lang', 'ru');

      const res = await fetch(wUrl.toString());
      if (!res.ok) throw new Error(`OWM weather error: ${res.status}`);
      const data = await res.json();

      // 3) город: если пустой — попробуем reverse geocoding в OWM
      let city = data?.name || '';
      if (!city) {
        try {
          const gUrl = new URL('https://api.openweathermap.org/geo/1.0/reverse');
          gUrl.searchParams.set('lat', la);
          gUrl.searchParams.set('lon', lo);
          gUrl.searchParams.set('limit', '1');
          gUrl.searchParams.set('appid', this.OPENWEATHER_KEY);
          const gRes = await fetch(gUrl.toString());
          if (gRes.ok) {
            const gData = await gRes.json();
            city = gData?.[0]?.local_names?.ru || gData?.[0]?.name || '';
          }
        } catch {}
      }

      return {
        city: city || 'Ваше местоположение',
        temperature: Math.round(data?.main?.temp ?? 0),
        description: DataService._capitalize(data?.weather?.[0]?.description || 'Погода'),
        icon: DataService._mapOWMIcon(data?.weather?.[0]?.icon)
      };
    } catch (err) {
      console.error('OWM failed, fallback to Open-Meteo:', err);
      // 4) фоллбэк без ключа — Open-Meteо
      return DataService._fallbackOpenMeteo(la, lo);
    }
  }

  // ===== helpers =====
  static _capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
  }

  static _mapOWMIcon(code) {
    if (!code) return 'fas fa-cloud';
    if (code.includes('01')) return 'fas fa-sun';
    if (code.includes('02') || code.includes('03')) return 'fas fa-cloud-sun';
    if (code.includes('04')) return 'fas fa-cloud';
    if (code.startsWith('09') || code.startsWith('10')) return 'fas fa-cloud-showers-heavy';
    if (code.startsWith('11')) return 'fas fa-bolt';
    if (code.startsWith('13')) return 'fas fa-snowflake';
    if (code.startsWith('50')) return 'fas fa-smog';
    return 'fas fa-cloud';
  }

  static async _fallbackOpenMeteo(lat, lon) {
    try {
      const url = new URL('https://api.open-meteo.com/v1/forecast');
      url.searchParams.set('latitude', lat);
      url.searchParams.set('longitude', lon);
      url.searchParams.set('current_weather', 'true');
      url.searchParams.set('timezone', 'auto');

      const r = await fetch(url.toString());
      if (!r.ok) throw new Error(`Open-Meteo error: ${r.status}`);
      const d = await r.json();
      const t = Math.round(d?.current_weather?.temperature ?? 0);

      return {
        city: 'Ваше местоположение',
        temperature: t,
        description: 'Погода сейчас',
        icon: 'fas fa-cloud-sun'
      };
    } catch (e) {
      console.error('Fallback failed:', e);
      return {
        city: 'Неизвестно',
        temperature: '--',
        description: 'Ошибка',
        icon: 'fas fa-cloud'
      };
    }
  }

  // ===== демо-методы как были =====
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

# Refactored OOP Dashboard

This is an ES Modules refactor of your dashboard into multiple files with clear responsibilities:

- `js/controllers/Dashboard.js` — orchestrates the app lifecycle, UI bindings, rendering, DnD, persistence.
- `js/models/*.js` — widget classes (Weather, Exchange, Stocks, Timer, Notes) all extend `Widget`.
- `js/services/*.js` — storage, notifications, and demo data providers.
- `js/views/*.js` — DOM assembly for widgets and modals.
- `js/utils/*.js` — small helpers for DOM and id generation.
- `css/app.css` — your original CSS, unmodified.
- `index.html` — uses `<script type="module">` and preserves your original structure/IDs.

Open `index.html` directly in a modern browser. No build step required.

# AccessibilityWidget – Widget de accesibilitate

Un script JavaScript autonom care oferă funcționalități de accesibilitate pentru site-uri web. Permite utilizatorilor să modifice vizualizarea și să interacționeze mai ușor cu conținutul.

## Funcționalități
- **Mărire text** – ajustează dimensiunea fontului pentru vizibilitate mai bună.
- **Contrast și culori** – schimbă contrastul, saturația și tema culorilor.
- **Citire vocală** – sintetizator vocal pentru citirea textului.
- **Evidențiere link-uri** – arată clar toate link-urile active.
- **Cursor mare** – cursor mai vizibil pentru utilizatori cu dificultăți de vedere.
- **Alte funcții** – afișare imagini fără ALT, invertire culori, reducere animații etc.
- **Persistență** – preferințele sunt salvate în `localStorage`.

## Evenimente disponibile
- `accessibilitySettingsChanged`
- `accessibilityApplied`

## Instalare
1. Creează fișierul `accessibility.js` și pune codul scriptului.
2. Include-l în HTML:
```html
<script src="accessibility.js"></script>
```
3. Scriptul se activează automat la `DOMContentLoaded`.

## Personalizare
```javascript
window.accessibilityWidget = new AccessibilityWidget({
    labels: {
        openPanel: "Deschide panou accesibilitate",
        closePanel: "Închide panou"
    },
    autoApply: true
});
```

## Exemple
- Butonul albastru din colțul dreapta-jos deschide panoul de accesibilitate.
- Utilizatorul poate modifica toate opțiunile în timp real.


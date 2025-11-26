class AccessibilityWidget {
  constructor(options = {}) {
    this.labels = Object.assign({
      increaseText: "Mărește textul",
      decreaseText: "Micșorează textul",
      resetText: "Resetare text",
      highContrast: "Contrast ridicat",
      lineHeight: "Toggle spațiere linii",
      letterSpacing: "Toggle spațiere litere",
      increaseSaturation: "Crește saturația",
      decreaseSaturation: "Scade saturația",
      readContent: "Citește conținutul",
      checkImages: "Verificare imagini fără ALT",
      toggleBigCursor: "Cursor mare: ON/OFF",
      toggleImages: "Ascunde/Afișează imagini",
      highlightLinks: "Evidențiază linkuri",
      resetAll: "Resetare completă",
      altWarning: "Imagini fără atribut ALT: "
    }, options.labels || {});

    this.fontSize = 16;
    this.saturation = 100;
    this.cursorClass = "cursor-big";

    this.init();
  }

  init() {
    this.injectStyles();
    this.createDynamicStyleElement();
    this.createElements();
    this.createButtons();
    this.addEventListeners();
    this.applyInitialCursorState();
  }

  createDynamicStyleElement() {
    // Creăm un element <style> pentru stilurile dinamice
    this.dynamicStyle = document.createElement("style");
    this.dynamicStyle.id = "accessibility-dynamic-styles";
    document.head.appendChild(this.dynamicStyle);
  }

  updateFontSize() {
    // Actualizăm stilurile dinamice pentru dimensiunea fontului
    this.dynamicStyle.textContent = `
      html, body {
        font-size: ${this.fontSize}px !important;
      }
    `;
  }

  injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
      #accessibilityBtn {
        position: fixed;
        bottom: 75px;
        right: 20px;
        z-index: 1000;
        background: #185A7D;
        border: none;
        border-radius: 8px;
        width: 44px;
        height: 44px;
        padding: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
      }
      #accessibilityBtn:hover {
        background: #387A9D;
        transform: scale(1.05);
      }
      #accessibilityBtn svg {
        width: 100%;
        height: 100%;
        fill: white;
        pointer-events: none;
      }
      #accessibilityPanel {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
        background: white;
        color: #444444;
        border-radius: 12px;
        padding: 0;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        display: none;
        width: 90%;
        max-width: 600px;
        max-height: 80vh;
        overflow: hidden;
      }
      #accessibilityPanel.show {
        display: block;
        animation: fadeIn 0.3s ease;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translate(-50%, -45%);
        }
        to {
          opacity: 1;
          transform: translate(-50%, -50%);
        }
      }
      #accessibilityPanel .panel-header {
        background: #185A7D;
        color: white;
        padding: 20px 25px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 12px 12px 0 0;
      }
      #accessibilityPanel .panel-header h3 {
        margin: 0;
        font-size: 20px;
        font-weight: 700;
        color: white;
      }
      #accessibilityPanel .panel-close {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        line-height: 1;
      }
      #accessibilityPanel .panel-close:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: rotate(90deg);
      }
      #accessibilityPanel .panel-body {
        padding: 25px;
        overflow-y: auto;
        max-height: calc(80vh - 80px);
      }
      #accessibilityPanel .panel-body::-webkit-scrollbar {
        width: 8px;
      }
      #accessibilityPanel .panel-body::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
      }
      #accessibilityPanel .panel-body::-webkit-scrollbar-thumb {
        background: #185A7D;
        border-radius: 4px;
      }
      #accessibilityPanel .panel-body::-webkit-scrollbar-thumb:hover {
        background: #387A9D;
      }
      #accessibilityPanel .button-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 12px;
      }
      #accessibilityPanel button.acc-button {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 18px;
        font-size: 15px;
        font-weight: 500;
        cursor: pointer;
        background: #f6f9ff;
        border: 2px solid #e1ecff;
        border-radius: 8px;
        color: #185A7D;
        transition: all 0.3s ease;
        text-align: left;
      }
      #accessibilityPanel button.acc-button:hover {
        background: #185A7D;
        color: white;
        border-color: #185A7D;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(24, 90, 125, 0.2);
      }
      #accessibilityPanel button.acc-button .icon {
        font-size: 20px;
        min-width: 24px;
        text-align: center;
      }
      #accessibilityOverlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9998;
        display: none;
      }
      #accessibilityOverlay.show {
        display: block;
        animation: overlayFadeIn 0.3s ease;
      }
      @keyframes overlayFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      /* Stiluri generale pentru opțiuni */
      html.high-contrast {
        background: black !important;
      }
      html.high-contrast body {
        background: black !important;
        color: white !important;
      }
      html.high-contrast *:not(#accessibilityPanel):not(#accessibilityPanel *):not(#accessibilityBtn):not(#accessibilityBtn *):not(#accessibilityOverlay) {
        color: white !important;
        border-color: white !important;
      }
      html.high-contrast section,
      html.high-contrast div:not(#accessibilityPanel):not(#accessibilityPanel *),
      html.high-contrast header,
      html.high-contrast footer,
      html.high-contrast main {
        background-color: black !important;
      }
      html.high-contrast a {
        color: yellow !important;
      }
      html.high-contrast button:not(.acc-button):not(.panel-close):not(#accessibilityBtn) {
        background: white !important;
        color: black !important;
      }
      html.high-contrast img {
        opacity: 0.8;
        filter: brightness(0.8) contrast(1.2);
      }
      body.line-height, body.line-height * { line-height: 2 !important; }
      body.letter-spacing, body.letter-spacing * { letter-spacing: 2px !important; }
      body.links-highlight a { outline: 2px solid #f30; padding: 4px; margin: 2px; text-decoration: none; }
      img.hidden-img { display: none !important; }
      html.saturation { filter: saturate(var(--saturation, 100%)); }

      /* Text size control */
      html.text-size-custom,
      html.text-size-custom body,
      html.text-size-custom body * {
        font-size: inherit !important;
      }

      /* Responsive */
      @media (max-width: 768px) {
        #accessibilityPanel {
          width: 95%;
          max-height: 90vh;
        }
        #accessibilityPanel .button-grid {
          grid-template-columns: 1fr;
        }
        #accessibilityPanel .panel-header h3 {
          font-size: 18px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  createElements() {
    // Butonul de deschidere
    this.btn = document.createElement("button");
    this.btn.id = "accessibilityBtn";
    this.btn.title = "Accesibilitate";
    this.btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="20" height="20">
        <path d="M480-720q-33 0-56.5-23.5T400-800q0-33 23.5-56.5T480-880q33 0 56.5 23.5T560-800q0 33-23.5 56.5T480-720ZM360-80v-520H120v-80h720v80H600v520h-80v-240h-80v240h-80Z"/>
      </svg>
    `;

    // Overlay-ul pentru fundal
    this.overlay = document.createElement("div");
    this.overlay.id = "accessibilityOverlay";

    // Panelul principal
    this.panel = document.createElement("div");
    this.panel.id = "accessibilityPanel";

    // Header
    const header = document.createElement("div");
    header.className = "panel-header";
    header.innerHTML = `
      <h3>Opțiuni de Accesibilitate</h3>
      <button class="panel-close" aria-label="Închide">×</button>
    `;

    // Body
    const body = document.createElement("div");
    body.className = "panel-body";

    // Grid pentru butoane
    this.buttonGrid = document.createElement("div");
    this.buttonGrid.className = "button-grid";
    body.appendChild(this.buttonGrid);

    this.panel.appendChild(header);
    this.panel.appendChild(body);

    document.body.appendChild(this.btn);
    document.body.appendChild(this.overlay);
    document.body.appendChild(this.panel);
  }

  applyInitialCursorState() {
    localStorage.setItem('isBigCursorEnabled', 0);
  }

  toggleBigCursor() {
    let isBigCursorEnabled = parseInt(localStorage.getItem('isBigCursorEnabled'));
    let element = document.body;
    if (!isBigCursorEnabled) {
        element.querySelectorAll("*")
        .forEach((el) => {
          el.style.cursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 512 512'%3E%3Cpath d='M429.742 319.31L82.49 0l-.231 471.744 105.375-100.826 61.89 141.083 96.559-42.358-61.89-141.083 145.549-9.25zM306.563 454.222l-41.62 18.259-67.066-152.879-85.589 81.894.164-333.193 245.264 225.529-118.219 7.512 67.066 152.878z' xmlns='http://www.w3.org/2000/svg'/%3E%3C/svg%3E"), auto`;;
        });
      localStorage.setItem('isBigCursorEnabled', 1);
    } else {
        element.querySelectorAll("*").forEach((el) => { el.style.cursor = 'auto'; });
        element.querySelectorAll("a").forEach((el) => { el.style.cursor = 'pointer'; });
      localStorage.setItem('isBigCursorEnabled', 0);
    }
  }

  resetAll() {
    const html = document.documentElement;

    // Resetare dimensiune font
    this.fontSize = 16;
    this.dynamicStyle.textContent = '';

    // Resetare saturație
    this.saturation = 100;
    html.style.filter = '';

    // Eliminare toate clasele de pe body
    document.body.classList.remove('high-contrast', 'line-height', 'letter-spacing', 'links-highlight');

    // Eliminare toate clasele de pe html
    html.classList.remove('high-contrast');

    // Resetare cursor
    document.body.querySelectorAll("*").forEach((el) => { el.style.cursor = ''; });
    document.body.querySelectorAll("a").forEach((el) => { el.style.cursor = 'pointer'; });
    localStorage.setItem('isBigCursorEnabled', 0);

    // Resetare imagini
    document.querySelectorAll("img.hidden-img").forEach(img => img.classList.remove("hidden-img"));

    // Oprire citire vocală
    speechSynthesis.cancel();
  }
  createButtons() {
    const html = document.documentElement;

    const buttons = [
      { icon: "🔍+", text: this.labels.increaseText, action: () => {
        this.fontSize += 2;
        this.updateFontSize();
      }},
      { icon: "🔍-", text: this.labels.decreaseText, action: () => {
        this.fontSize = Math.max(10, this.fontSize - 2);
        this.updateFontSize();
      }},
      { icon: "↺", text: this.labels.resetText, action: () => {
        this.fontSize = 16;
        this.dynamicStyle.textContent = ''; // Ștergem stilurile custom
      }},
      { icon: "◐", text: this.labels.highContrast, action: () => {
        document.body.classList.toggle("high-contrast");
        html.classList.toggle("high-contrast");
      }},
      { icon: "≡", text: this.labels.lineHeight, action: () => {
        document.body.classList.toggle("line-height");
      }},
      { icon: "A ↔", text: this.labels.letterSpacing, action: () => {
        document.body.classList.toggle("letter-spacing");
      }},
      { icon: "🎨+", text: this.labels.increaseSaturation, action: () => {
        this.saturation = Math.min(300, this.saturation + 20);
        html.style.filter = `saturate(${this.saturation}%)`;
      }},
      { icon: "🎨-", text: this.labels.decreaseSaturation, action: () => {
        this.saturation = Math.max(0, this.saturation - 20);
        html.style.filter = `saturate(${this.saturation}%)`;
      }},
      { icon: "🔊", text: this.labels.readContent, action: () => {
        const utterance = new SpeechSynthesisUtterance(document.body.innerText);
        utterance.lang = "ro-RO";
        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);
      }},
      { icon: "🖼", text: this.labels.checkImages, action: () => {
        const imgs = document.querySelectorAll("img:not([alt])");
        alert(this.labels.altWarning + imgs.length);
      }},
      { icon: "➤", text: this.labels.toggleBigCursor, action: () => this.toggleBigCursor() },
      { icon: "👁", text: this.labels.toggleImages, action: () => {
        document.querySelectorAll("img").forEach(img => img.classList.toggle("hidden-img"));
      }},
      { icon: "🔗", text: this.labels.highlightLinks, action: () => {
        document.body.classList.toggle("links-highlight");
      }},
      { icon: "🔄", text: this.labels.resetAll, action: () => this.resetAll() },
    ];

    buttons.forEach(({ icon, text, action }) => {
      const b = document.createElement("button");
      b.className = "acc-button";
      b.innerHTML = `<span class="icon">${icon}</span><span>${text}</span>`;
      b.addEventListener("click", e => {
        e.stopPropagation();
        action();
      });
      this.buttonGrid.appendChild(b);
    });
  }

  addEventListeners() {
    // Deschide/închide panelul la click pe buton
    this.btn.addEventListener("click", e => {
      e.stopPropagation();
      this.togglePanel();
    });

    // Închide panelul la click pe butonul X din header
    const closeBtn = this.panel.querySelector(".panel-close");
    closeBtn.addEventListener("click", e => {
      e.stopPropagation();
      this.closePanel();
    });

    // Închide panelul la click pe overlay
    this.overlay.addEventListener("click", () => {
      this.closePanel();
    });

    // Previne închiderea la click în interiorul panelului
    this.panel.addEventListener("click", e => {
      e.stopPropagation();
    });

    // Închide cu tasta ESC
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && this.panel.classList.contains("show")) {
        this.closePanel();
      }
    });
  }

  togglePanel() {
    if (this.panel.classList.contains("show")) {
      this.closePanel();
    } else {
      this.openPanel();
    }
  }

  openPanel() {
    this.panel.classList.add("show");
    this.overlay.classList.add("show");
    document.body.style.overflow = "hidden";
  }

  closePanel() {
    this.panel.classList.remove("show");
    this.overlay.classList.remove("show");
    document.body.style.overflow = "";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new AccessibilityWidget();
});

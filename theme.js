const THEMES = ['light', 'dark', 'auto'];
const LABELS = { light: '☀️ Claro', dark: '🌙 Oscuro', auto: '⚙️ Auto' };

let index = THEMES.indexOf(localStorage.getItem('theme-mode') || 'auto');

function applyTheme(theme) {
  document.documentElement.classList.remove('light-mode', 'dark-mode');
  if (theme !== 'auto') document.documentElement.classList.add(`${theme}-mode`);
  localStorage.setItem('theme-mode', theme);
}

applyTheme(THEMES[index]);

document.addEventListener('DOMContentLoaded', () => {
  const btn = Object.assign(document.createElement('button'), {
    id: 'theme-toggle',
    innerHTML: LABELS[THEMES[index]],
  });

  btn.addEventListener('click', () => {
    index = (index + 1) % THEMES.length;
    applyTheme(THEMES[index]);
    btn.innerHTML = LABELS[THEMES[index]];
  });

  document.body.appendChild(btn);
});
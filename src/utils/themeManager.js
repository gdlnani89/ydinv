/**
 * Gerenciador de tema para alternar entre modo claro e escuro
 */

const THEME_KEY = 'app-theme';
const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';

/**
 * Obtém o tema atual do localStorage ou usa o tema do sistema
 */
export function getCurrentTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  
  if (savedTheme) {
    return savedTheme;
  }
  
  // Se não há tema salvo, verifica a preferência do sistema
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return DARK_THEME;
  }
  
  return LIGHT_THEME;
}

/**
 * Define o tema e salva no localStorage
 */
export function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
}

/**
 * Aplica o tema ao documento
 */
export function applyTheme(theme) {
  const root = document.documentElement;
  
  if (theme === DARK_THEME) {
    root.setAttribute('data-theme', 'dark');
    root.classList.add('dark-theme');
    root.classList.remove('light-theme');
  } else {
    root.setAttribute('data-theme', 'light');
    root.classList.add('light-theme');
    root.classList.remove('dark-theme');
  }
}

/**
 * Alterna entre os temas
 */
export function toggleTheme() {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
  setTheme(newTheme);
  return newTheme;
}

/**
 * Inicializa o tema na aplicação
 */
export function initializeTheme() {
  const theme = getCurrentTheme();
  applyTheme(theme);
  return theme;
}

/**
 * Escuta mudanças na preferência do sistema
 */
export function watchSystemTheme() {
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', (e) => {
      // Só muda se não há tema salvo pelo usuário
      if (!localStorage.getItem(THEME_KEY)) {
        const newTheme = e.matches ? DARK_THEME : LIGHT_THEME;
        applyTheme(newTheme);
      }
    });
  }
} 
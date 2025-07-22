import { ref, watch } from 'vue';
import { 
  getCurrentTheme, 
  setTheme, 
  toggleTheme, 
  initializeTheme, 
  watchSystemTheme 
} from '../utils/themeManager.js';

export function useTheme() {
  const currentTheme = ref(getCurrentTheme());
  
  // Inicializa o tema
  initializeTheme();
  
  // Escuta mudanças na preferência do sistema
  watchSystemTheme();
  
  // Função para alternar tema
  const switchTheme = () => {
    const newTheme = toggleTheme();
    currentTheme.value = newTheme;
  };
  
  // Função para definir tema específico
  const changeTheme = (theme) => {
    setTheme(theme);
    currentTheme.value = theme;
  };
  
  // Computed para verificar se é tema escuro
  const isDark = () => currentTheme.value === 'dark';
  
  // Computed para verificar se é tema claro
  const isLight = () => currentTheme.value === 'light';
  
  // Computed para o ícone do tema
  const themeIcon = () => isDark() ? 'bi-sun' : 'bi-moon';
  
  // Computed para o texto do tema
  const themeText = () => isDark() ? 'Modo Claro' : 'Modo Escuro';
  
  return {
    currentTheme,
    switchTheme,
    changeTheme,
    isDark,
    isLight,
    themeIcon,
    themeText
  };
} 
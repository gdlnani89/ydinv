<template>
  <button 
    @click="toggleTheme" 
    class="theme-toggle-btn"
    :title="currentTheme === 'dark' ? 'Modo Claro' : 'Modo Escuro'"
    type="button"
  >
    <i :class="['bi', currentTheme === 'dark' ? 'bi-sun' : 'bi-moon']"></i>
  </button>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getCurrentTheme, toggleTheme, applyTheme } from '../utils/themeManager.js';

export default {
  name: 'ThemeToggle',
  setup() {
    const currentTheme = ref('light');
    
    const handleToggleTheme = () => {
      const newTheme = toggleTheme();
      currentTheme.value = newTheme;
    };
    
    onMounted(() => {
      currentTheme.value = getCurrentTheme();
      applyTheme(currentTheme.value);
      console.log('ThemeToggle mounted, current theme:', currentTheme.value);
    });
    
    return {
      currentTheme,
      toggleTheme: handleToggleTheme
    };
  }
}
</script>

<style scoped>
.theme-toggle-btn {
  background: var(--primary-color);
  border: 2px solid var(--primary-color);
  color: white;
  font-size: 1.2rem;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.theme-toggle-btn:hover {
  background-color: var(--hover-bg);
  transform: scale(1.1);
}

.theme-toggle-btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--primary-color);
}

.theme-toggle-btn i {
  transition: transform 0.3s ease;
}

.theme-toggle-btn:hover i {
  transform: rotate(180deg);
}
</style> 
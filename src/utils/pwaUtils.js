// Utilitários para PWA
export const pwaUtils = {
  // Verifica se o app está instalado como PWA
  isInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
  },

  // Verifica se está em modo offline
  isOffline() {
    return !navigator.onLine;
  },

  // Mostra notificação de instalação
  showInstallPrompt() {
    // Esta função pode ser expandida para mostrar um prompt personalizado
    console.log('PWA pode ser instalada');
  },

  // Salva dados offline
  saveOfflineData(key, data) {
    if ('serviceWorker' in navigator) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  },

  // Carrega dados offline
  loadOfflineData(key) {
    if ('serviceWorker' in navigator) {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    }
    return null;
  },

  // Verifica se o navegador suporta PWA
  isPWASupported() {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  }
};

// Event listeners para PWA
export const setupPWAEvents = () => {
  // Listener para mudanças de conectividade
  window.addEventListener('online', () => {
    console.log('App está online');
    // Aqui você pode adicionar lógica para sincronizar dados
  });

  window.addEventListener('offline', () => {
    console.log('App está offline');
    // Aqui você pode adicionar lógica para modo offline
  });

  // Listener para antes da instalação
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    console.log('PWA pode ser instalada');
    // Aqui você pode armazenar o evento para mostrar um prompt personalizado
  });

  // Listener para quando o app é instalado
  window.addEventListener('appinstalled', () => {
    console.log('PWA foi instalada com sucesso!');
  });
}; 
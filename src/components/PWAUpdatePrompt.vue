<template>
  <div v-if="needRefresh" class="pwa-update-prompt">
    <div class="pwa-update-content">
      <div class="pwa-update-icon">
        <i class="bi bi-arrow-clockwise"></i>
      </div>
      <div class="pwa-update-text">
        <h6>Nova versão disponível!</h6>
        <p>Uma nova versão do Ydin está disponível. Atualize para obter as últimas melhorias.</p>
      </div>
      <div class="pwa-update-actions">
        <button @click="updateServiceWorker" class="btn btn-primary btn-sm">
          <i class="bi bi-download"></i> Atualizar
        </button>
        <button @click="closePrompt" class="btn btn-outline-secondary btn-sm">
          <i class="bi bi-x"></i> Depois
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { registerSW } from 'virtual:pwa-register'

export default {
  name: 'PWAUpdatePrompt',
  setup() {
    const needRefresh = ref(false)
    const updateSW = ref(null)

    onMounted(() => {
      updateSW.value = registerSW({
        onNeedRefresh() {
          needRefresh.value = true
        },
        onOfflineReady() {
          console.log('PWA está pronto para uso offline')
        },
        onRegistered(swRegistration) {
          console.log('Service Worker registrado:', swRegistration)
        },
        onRegisterError(error) {
          console.error('Erro ao registrar Service Worker:', error)
        }
      })
    })

    const updateServiceWorker = async () => {
      if (updateSW.value) {
        await updateSW.value()
        needRefresh.value = false
      }
    }

    const closePrompt = () => {
      needRefresh.value = false
    }

    return {
      needRefresh,
      updateServiceWorker,
      closePrompt
    }
  }
}
</script>

<style scoped>
.pwa-update-prompt {
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  z-index: 9999;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid #e9ecef;
  animation: slideUp 0.3s ease-out;
}

.pwa-update-content {
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.pwa-update-icon {
  font-size: 1.5rem;
  color: #007bff;
  flex-shrink: 0;
}

.pwa-update-text {
  flex: 1;
}

.pwa-update-text h6 {
  margin: 0 0 0.25rem 0;
  font-weight: 600;
  color: #333;
}

.pwa-update-text p {
  margin: 0;
  font-size: 0.875rem;
  color: #666;
  line-height: 1.4;
}

.pwa-update-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 576px) {
  .pwa-update-prompt {
    left: 10px;
    right: 10px;
    bottom: 10px;
  }
  
  .pwa-update-content {
    flex-direction: column;
    text-align: center;
  }
  
  .pwa-update-actions {
    width: 100%;
    justify-content: center;
  }
}
</style> 
<template>
  <div class="modal-backdrop" @click="$emit('fechar')">
    <div class="modal-dialog" @click.stop>
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="bi bi-pencil-square me-2"></i>
            Gerenciar Controles
          </h5>
          <button type="button" class="btn-close" @click="$emit('fechar')"></button>
        </div>
        <div class="modal-body">
          <ul class="list-group">
            <li v-for="controle in controles" :key="controle.id" class="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{{ controle.nome }}</strong>
                <span v-if="controle.valorPadrao" class="badge bg-primary ms-2">R$ {{ controle.valorPadrao }}</span>
                <div v-if="controle.descricao" class="text-muted small">{{ controle.descricao }}</div>
              </div>
              <div class="d-flex gap-2">
                <button class="btn btn-sm btn-outline-primary" @click="$emit('editar', controle)"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm btn-outline-danger" @click="$emit('excluir', controle)"><i class="bi bi-trash"></i></button>
              </div>
            </li>
          </ul>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" @click="$emit('fechar')">
            <i class="bi bi-x-lg me-1"></i>Fechar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    controles: { type: Array, required: true }
  }
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.modal-dialog {
  background: white;
  border-radius: 16px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  animation: slideIn 0.3s ease-out;
  max-height: 90vh;
  overflow: hidden;
}
.modal-content {
  border: none;
  border-radius: 16px;
}
.modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px 16px 0 0;
  padding: 1.5rem;
  border-bottom: none;
}
.modal-title {
  font-weight: 600;
  margin: 0;
  font-size: 1.15rem;
}
.btn-close {
  filter: invert(1);
  opacity: 0.8;
}
.btn-close:hover {
  opacity: 1;
}
.modal-body {
  padding: 2rem;
}
.list-group-item {
  border: none;
  border-bottom: 1px solid #e9ecef;
  background: transparent;
}
.list-group-item:last-child {
  border-bottom: none;
}
.modal-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
  border-radius: 0 0 16px 16px;
}
.btn {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}
.btn-outline-primary {
  border: 2px solid #667eea;
  color: #667eea;
}
.btn-outline-primary:hover {
  background: #667eea;
  color: #fff;
}
.btn-outline-danger {
  border: 2px solid #dc3545;
  color: #dc3545;
}
.btn-outline-danger:hover {
  background: #dc3545;
  color: #fff;
}
@keyframes slideIn {
  from { 
    transform: translateY(-20px) scale(0.95); 
    opacity: 0; 
  }
  to { 
    transform: translateY(0) scale(1); 
    opacity: 1; 
  }
}
@media (max-width: 576px) {
  .modal-dialog {
    margin: 0.5rem;
    max-width: none;
  }
  .modal-body {
    padding: 1.5rem;
  }
  .modal-footer {
    padding: 1rem 1.5rem;
  }
}
</style> 
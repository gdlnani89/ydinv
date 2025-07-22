<template>
  <div class="modal-backdrop" @click="$emit('fechar')">
    <div class="modal-dialog" @click.stop>
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="bi bi-plus-circle me-2"></i>
            {{ tituloModal }}
          </h5>
          <button type="button" class="btn-close" @click="$emit('fechar')"></button>
        </div>
        <form @submit.prevent="salvar">
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label fw-semibold">Nome do controle *</label>
              <input type="text" class="form-control form-control-lg" v-model="nome" required maxlength="40">
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold">Valor padrão</label>
              <input type="text" class="form-control form-control-lg" v-model="valorPadrao" placeholder="Opcional">
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold">Descrição</label>
              <input type="text" class="form-control" v-model="descricao" maxlength="60" placeholder="Opcional">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" @click="$emit('fechar')">
              <i class="bi bi-x-lg me-1"></i>Cancelar
            </button>
            <button type="submit" class="btn btn-primary">
              <i class="bi bi-check-lg me-1"></i>Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    controle: { type: Object, default: null }
  },
  data() {
    return {
      nome: this.controle ? this.controle.nome : '',
      valorPadrao: this.controle ? this.controle.valorPadrao : '',
      descricao: this.controle ? this.controle.descricao : ''
    };
  },
  watch: {
    controle: {
      immediate: true,
      handler(val) {
        if (val) {
          this.nome = val.nome || '';
          this.valorPadrao = val.valorPadrao || '';
          this.descricao = val.descricao || '';
        } else {
          this.nome = '';
          this.valorPadrao = '';
          this.descricao = '';
        }
      }
    }
  },
  computed: {
    tituloModal() {
      return this.controle && this.controle.id ? 'Editar Controle' : 'Novo Controle';
    }
  },
  methods: {
    salvar() {
      if (!this.nome.trim()) return;
      this.$emit('salvar', {
        nome: this.nome.trim(),
        valorPadrao: this.valorPadrao,
        descricao: this.descricao
      });
      this.nome = '';
      this.valorPadrao = '';
      this.descricao = '';
    }
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
.form-label {
  color: #495057;
  margin-bottom: 0.5rem;
}
.form-control {
  border: 2px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.2s ease;
}
.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}
.form-control-lg {
  padding: 0.75rem 1rem;
  font-size: 1rem;
}
.modal-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
  border-radius: 0 0 16px 16px;
}
.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}
.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}
.btn-outline-secondary {
  border: 2px solid #6c757d;
  color: #6c757d;
}
.btn-outline-secondary:hover {
  background: #6c757d;
  border-color: #6c757d;
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
<template>
  <div class="fundo-modal">
    <div class="card">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="card-title mb-0">Gerenciar Contas</h5>
          <button @click="fecharModal" class="btn-close" type="button">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <!-- Lista de contas -->
        <div v-if="contas.length > 0" class="contas-lista">
          <div 
            v-for="conta in contas" 
            :key="conta.id" 
            class="conta-item"
            :class="{ 'editando': contaEditando === conta.id }"
          >
            <!-- Modo visualização -->
            <div v-if="contaEditando !== conta.id" class="conta-info">
              <div class="conta-header">
                <div class="conta-cor" :style="{ backgroundColor: conta.cor }"></div>
                <div class="conta-detalhes">
                  <h6 class="conta-nome">{{ conta.nome }}</h6>
                  <span class="conta-saldo">{{ formatCurrency(conta.saldo || 0) }}</span>
                </div>
              </div>
              <div class="conta-acoes">
                <button @click="editarConta(conta)" class="btn btn-sm btn-outline-primary">
                  <i class="bi bi-pencil"></i>
                </button>
                <button @click="excluirConta(conta)" class="btn btn-sm btn-outline-danger">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>

            <!-- Modo edição -->
            <div v-else class="conta-edicao">
              <div class="mb-2">
                <label class="form-label small">Nome da Conta</label>
                <input 
                  v-model="contaEditada.nome" 
                  type="text" 
                  class="form-control form-control-sm"
                  placeholder="Nome da conta"
                >
              </div>
              
              <div class="mb-2">
                <label class="form-label small">Cor</label>
                <div class="cores-grid">
                  <div 
                    v-for="cor in cores" 
                    :key="cor.nome"
                    class="cor-item"
                    :class="{ 'selecionada': contaEditada.cor === cor.valor }"
                    :style="{ backgroundColor: cor.valor }"
                    @click="selecionarCor(cor.valor)"
                    :title="cor.nome"
                  ></div>
                </div>
              </div>

              <div class="d-flex gap-2">
                <button @click="salvarEdicao(conta)" class="btn btn-sm btn-success">
                  <i class="bi bi-check"></i> Salvar
                </button>
                <button @click="cancelarEdicao" class="btn btn-sm btn-secondary">
                  <i class="bi bi-x"></i> Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Mensagem quando não há contas -->
        <div v-else class="text-center py-4">
          <i class="bi bi-bank fs-1 text-muted mb-3"></i>
          <h6 class="text-muted">Nenhuma conta cadastrada</h6>
          <p class="text-muted small">Adicione uma conta para começar</p>
        </div>

        <!-- Botões de ação -->
        <div class="d-flex gap-2 mt-3">
          <button @click="adicionarNovaConta" class="btn btn-primary flex-fill">
            <i class="bi bi-plus-lg"></i> Nova Conta
          </button>
          <button @click="fecharModal" class="btn btn-secondary">
            Fechar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['contas'],
  data() {
    return {
      contaEditando: null,
      contaEditada: {
        nome: '',
        cor: '#007bff'
      },
      cores: [
        { nome: 'Azul', valor: '#007bff' },
        { nome: 'Verde', valor: '#28a745' },
        { nome: 'Vermelho', valor: '#dc3545' },
        { nome: 'Laranja', valor: '#fd7e14' },
        { nome: 'Roxo', valor: '#6f42c1' },
        { nome: 'Rosa', valor: '#e83e8c' },
        { nome: 'Teal', valor: '#20c997' },
        { nome: 'Cinza', valor: '#6c757d' },
        { nome: 'Amarelo', valor: '#ffc107' },
        { nome: 'Indigo', valor: '#6610f2' },
        { nome: 'Cyan', valor: '#17a2b8' },
        { nome: 'Marrom', valor: '#8b4513' }
      ]
    }
  },
  mounted() {
    // Escuta o evento para editar uma conta específica
    window.addEventListener('editar-conta-especifica', this.editarContaEspecifica);
  },
  beforeUnmount() {
    // Remove o listener quando o componente for destruído
    window.removeEventListener('editar-conta-especifica', this.editarContaEspecifica);
  },
  methods: {
    fecharModal() {
      this.$emit('fechar-modal');
    },
    
    editarConta(conta) {
      this.contaEditando = conta.id;
      this.contaEditada = {
        nome: conta.nome,
        cor: conta.cor
      };
    },
    
    cancelarEdicao() {
      this.contaEditando = null;
      this.contaEditada = {
        nome: '',
        cor: '#007bff'
      };
    },
    
    selecionarCor(cor) {
      this.contaEditada.cor = cor;
    },
    
    salvarEdicao(contaOriginal) {
      if (!this.contaEditada.nome.trim()) {
        alert('Por favor, digite o nome da conta');
        return;
      }
      
      const contaAtualizada = {
        ...contaOriginal,
        nome: this.contaEditada.nome.trim(),
        cor: this.contaEditada.cor
      };
      
      this.$emit('atualizar-conta', contaAtualizada);
      this.cancelarEdicao();
    },
    
    excluirConta(conta) {
      if (confirm(`Tem certeza que deseja excluir a conta "${conta.nome}"?`)) {
        this.$emit('excluir-conta', conta.id);
      }
    },
    
    adicionarNovaConta() {
      this.$emit('abrir-modal-cadastro');
      this.fecharModal();
    },
    
    editarContaEspecifica(event) {
      const conta = event.detail;
      this.editarConta(conta);
    }
  }
}
</script>

<style scoped>
.fundo-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.card {
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #6c757d;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: color 0.2s;
}

.btn-close:hover {
  color: #dc3545;
}

.contas-lista {
  max-height: 400px;
  overflow-y: auto;
}

.conta-item {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  transition: all 0.2s ease;
}

.conta-item:hover {
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
}

.conta-item.editando {
  border-color: #28a745;
  background-color: #f8fff9;
}

.conta-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.conta-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.conta-cor {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.conta-detalhes {
  display: flex;
  flex-direction: column;
}

.conta-nome {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.conta-saldo {
  font-size: 0.875rem;
  color: #6c757d;
  font-weight: 500;
}

.conta-acoes {
  display: flex;
  gap: 0.5rem;
}

.cores-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 6px;
  margin-top: 4px;
}

.cor-item {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
  position: relative;
}

.cor-item:hover {
  transform: scale(1.1);
  border-color: #333;
}

.cor-item.selecionada {
  border-color: #333;
  transform: scale(1.1);
  box-shadow: 0 0 0 2px white, 0 0 0 4px #333;
}

.cor-item.selecionada::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
}

.form-control-sm {
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}
</style> 
<template>
  <section class="content-section" id="cartoes">
    <div class="header-section">
      <div class="d-flex justify-content-between align-items-start">
        <Cabecalho titulo="Cartões" descricao="Gerencie seus cartões de crédito e débito." />
        <div class="d-flex align-items-center gap-2">
          <button 
            @click="abrirModalCartao"
            class="btn btn-sm btn-outline-primary"
            title="Adicionar Cartão"
          >
            <i class="bi bi-plus-lg"></i> Novo Cartão
          </button>
        </div>
      </div>
    </div>
    <div class="scrollable-content">
      <div v-if="cartoes.length > 0" class="cartoes-grid">
        <div v-for="cartao in cartoes" :key="cartao.id" class="cartao-card">
          <div class="cartao-header">
            <div>
              <h5 class="cartao-nome">{{ cartao.nome }}</h5>
              <span class="cartao-bandeira">{{ cartao.bandeira }}</span>
            </div>
            <div class="cartao-acoes">
              <button class="btn btn-sm btn-outline-primary" @click="editarCartao(cartao)" title="Editar cartão">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger" @click="excluirCartao(cartao)" title="Excluir cartão">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
          <div class="cartao-info">
            <div class="info-item">
              <span class="info-label">Limite:</span>
              <span class="info-value">{{ formatCurrency(cartao.limite) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Fechamento:</span>
              <span class="info-value">Dia {{ cartao.diaFechamento }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Vencimento:</span>
              <span class="info-value">Dia {{ cartao.diaVencimento }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-5">
        <i class="bi bi-credit-card fs-1 text-muted mb-3"></i>
        <h5 class="text-muted">Nenhum cartão cadastrado</h5>
        <p class="text-muted">Clique em "Novo Cartão" para adicionar</p>
      </div>
    </div>
    <ModalCadastraCartao 
      v-show="modalCartao"
      :cartao="cartaoEmEdicao"
      @fechar-modal-cartao="fecharModalCartao"
      @adicionar-cartao="$emit('adicionar-cartao', $event)"
      @atualizar-cartao="$emit('atualizar-cartao', $event)"
    />
  </section>
</template>

<script>
import Cabecalho from './Cabecalho.vue';
import ModalCadastraCartao from './ModalCadastraCartao.vue';
import { formatCurrency } from '../utils/formatters.js';

export default {
  props: ['cartoes'],
  data() {
    return {
      modalCartao: false,
      cartaoEmEdicao: null,
    };
  },
  components: {
    Cabecalho,
    ModalCadastraCartao,
  },
  methods: {
    abrirModalCartao() {
      this.modalCartao = true;
      this.cartaoEmEdicao = null;
    },
    fecharModalCartao() {
      this.modalCartao = false;
      this.cartaoEmEdicao = null;
    },
    editarCartao(cartao) {
      this.cartaoEmEdicao = cartao;
      this.modalCartao = true;
    },
    excluirCartao(cartao) {
      if (confirm(`Tem certeza que deseja excluir o cartão "${cartao.nome}"?`)) {
        this.$emit('excluir-cartao', cartao.id);
      }
    },
    formatCurrency(valor) {
      return formatCurrency(valor);
    }
  }
}
</script>

<style scoped>
.content-section {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.header-section {
  flex-shrink: 0;
  padding: 0.75rem;
  background: white;
  border-bottom: 1px solid #e9ecef;
}

.scrollable-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.cartoes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.2rem;
  margin: 0;
}

.cartao-card {
  background: white;
  border-radius: 12px;
  padding: 1.2rem;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #007bff;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
}

.cartao-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.cartao-header {
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  position: relative;
}

.cartao-nome {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.cartao-bandeira {
  font-size: 0.9rem;
  color: #666;
  display: block;
  margin-top: 0.25rem;
}

.cartao-acoes {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.cartao-info {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.info-label {
  font-size: 0.75rem;
  color: #666;
  font-weight: 500;
}

.info-value {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

@media (max-width: 768px) {
  .cartoes-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style> 
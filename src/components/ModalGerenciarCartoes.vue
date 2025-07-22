<template>
  <div class="fundo-modal">
    <div class="card modal-cartoes">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="card-title mb-0">Cartões Cadastrados</h5>
        <button class="btn btn-secondary btn-sm" @click="$emit('fechar')">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <div v-if="cartoes.length > 0" class="cartoes-lista">
        <div v-for="cartao in cartoes" :key="cartao.id" class="cartao-item">
          <div class="cartao-info">
            <div class="cartao-nome">{{ cartao.nome }}</div>
            <div class="cartao-bandeira">{{ cartao.bandeira }}</div>
            <div class="cartao-limite">Limite: {{ formatCurrency(cartao.limite) }}</div>
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
      </div>
      <div v-else class="text-center text-muted py-4">
        <i class="bi bi-credit-card fs-1 mb-2"></i>
        <div>Nenhum cartão cadastrado</div>
      </div>
      <div class="d-flex justify-content-end mt-3">
        <button class="btn btn-primary" @click="abrirModalCadastro">Adicionar Cartão</button>
      </div>
      <ModalCadastraCartao
        v-if="mostrarModalCadastro"
        :cartao="cartaoEmEdicao"
        @fechar-modal-cartao="fecharModalCadastro"
        @adicionar-cartao="$emit('adicionar-cartao', $event)"
        @atualizar-cartao="$emit('atualizar-cartao', $event)"
      />
    </div>
  </div>
</template>

<script>
import ModalCadastraCartao from './ModalCadastraCartao.vue';
import { formatCurrency } from '../utils/formatters.js';

export default {
  props: ['cartoes'],
  components: { ModalCadastraCartao },
  data() {
    return {
      mostrarModalCadastro: false,
      cartaoEmEdicao: null,
    };
  },
  methods: {
    abrirModalCadastro() {
      this.cartaoEmEdicao = null;
      this.mostrarModalCadastro = true;
    },
    fecharModalCadastro() {
      this.cartaoEmEdicao = null;
      this.mostrarModalCadastro = false;
    },
    editarCartao(cartao) {
      this.cartaoEmEdicao = cartao;
      this.mostrarModalCadastro = true;
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
.fundo-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: var(--modal-bg, rgba(0,0,0,0.3));
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.modal-cartoes {
  background: var(--modal-content-bg, #fff);
  border-radius: 12px;
  padding: 1.2rem 1.2rem 1rem 1.2rem;
  max-width: 420px;
  width: 96vw;
  max-height: 90vh;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  overflow-y: auto;
  position: relative;
}
.cartoes-lista {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.cartao-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 0.7rem 1rem;
}
.cartao-info {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}
.cartao-nome {
  font-weight: 600;
  font-size: 1rem;
  color: #333;
}
.cartao-bandeira {
  font-size: 0.9rem;
  color: #666;
}
.cartao-limite {
  font-size: 0.9rem;
  color: #007bff;
}
.cartao-acoes {
  display: flex;
  gap: 0.5rem;
}
@media (max-width: 600px) {
  .modal-cartoes {
    max-width: 99vw;
    padding: 0.7rem 0.5rem 0.7rem 0.5rem;
  }
  .cartao-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.3rem;
    padding: 0.6rem 0.5rem;
  }
  .cartao-acoes {
    width: 100%;
    justify-content: flex-end;
  }
}
</style> 
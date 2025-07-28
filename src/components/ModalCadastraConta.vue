<template>
  <div class="fundo-modal">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title heading-4">Cadastro de Conta</h5>
        
        <div class="mb-3">
          <label class="form-label">Nome do Banco</label>
          <input 
            v-model="nomeBanco" 
            type="text" 
            class="form-control" 
            placeholder="Ex: Nubank, Itaú, Bradesco..."
          >
        </div>

        <div class="mb-3">
          <label class="form-label">Cor do Header</label>
          <div class="cores-grid">
            <div 
              v-for="cor in cores" 
              :key="cor.nome"
              class="cor-item"
              :class="{ 'selecionada': corSelecionada === cor.valor }"
              :style="{ backgroundColor: cor.valor }"
              @click="selecionarCor(cor.valor)"
              :title="cor.nome"
            ></div>
          </div>
        </div>

        <div class="d-flex gap-2">
          <button @click="salvarConta" class="btn btn-primary flex-fill">Salvar</button>
          <button @click="fecharModal" class="btn btn-secondary">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['modal'],
  data() {
    return {
      nomeBanco: '',
      corSelecionada: '#007bff',
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
  methods: {
    selecionarCor(cor) {
      this.corSelecionada = cor;
    },
    salvarConta() {
      if (!this.nomeBanco.trim()) {
        alert('Por favor, digite o nome do banco');
        return;
      }

      const conta = {
        id: Date.now(),
        nome: this.nomeBanco.trim(),
        cor: this.corSelecionada,
        saldo: 0
      };

      this.$emit('adicionar-conta', conta); // <-- emite para o pai
      this.nomeBanco = '';
      this.corSelecionada = '#007bff';
      this.$emit('fechar-modal'); // <-- fecha o modal
    },
    fecharModal() {
      this.$emit('fechar-modal');
    }
  }
}
</script>

<style scoped>

.card {
  max-width: 400px;
  width: 90%;
}

.cores-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  margin-top: 8px;
}

.cor-item {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  border: 3px solid transparent;
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
</style>
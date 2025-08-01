<script>
import Cabecalho from './Cabecalho.vue';
import BtnAdd from './BtnAdd.vue';
import ModalCadastraFatura from './ModalCadastraFatura.vue';
import TotalCard from './TotalCard.vue';
import Periodo from './Periodo.vue';
import { useBalancePrivacy } from '../composables/useBalancePrivacy.js';
import currencyMixin from '../mixins/currencyMixin.js';

export default{
  mixins: [currencyMixin],
  setup() {
    const { isBalanceHidden, toggleBalancePrivacy, formatBalanceWithPrivacy } = useBalancePrivacy();
    return {
      isBalanceHidden,
      toggleBalancePrivacy,
      formatBalanceWithPrivacy
    };
  },
  props: ['cartoes', 'faturas'],
  data(){
    return{
      modalFatura: false,
      dia: new Date().getDate(),
      cartoesExpandidos: [],
      cartaoEmEdicao: null,
      periodoSelecionado: '',
    }
  },
  components:{
    Cabecalho,
    BtnAdd,
    ModalCadastraFatura,
    TotalCard,
    Periodo,
  },
  methods: {
    abrirModalFatura(){
      this.modalFatura = true;
    },
    fecharModalFatura(){
      this.modalFatura = false;
    },
    atualizarPeriodo(novoPeriodo) {
      this.periodoSelecionado = novoPeriodo;
    },

    formatarData(data) {
      // Formata a data de forma segura (evita problemas de fuso horário)
      const [ano, mes, dia] = data.split('-');
      return `${dia}/${mes}/${ano}`;
    },

    
    ativarModoEdicao(cartaoId) {
      if (this.cartaoEmEdicao === cartaoId) {
        this.cartaoEmEdicao = null;
      } else {
        this.cartaoEmEdicao = cartaoId;
      }
    },
    
    expandirCartao(cartaoId) {
      if (this.cartoesExpandidos.includes(cartaoId)) {
        this.cartoesExpandidos = this.cartoesExpandidos.filter(id => id !== cartaoId);
      } else {
        this.cartoesExpandidos.push(cartaoId);
      }
    },
    
    editarCartao(cartao) {
      this.$emit('editar-cartao', cartao);
    },
    
    excluirCartao(cartao) {
      if (confirm(`Tem certeza que deseja excluir o cartão "${cartao.nome}"?`)) {
        this.$emit('excluir-cartao', cartao.id);
      }
    },

    editarFatura(fatura) {
      this.$emit('editar-fatura', fatura);
    },
    
    excluirFatura(fatura) {
      if (confirm(`Tem certeza que deseja excluir a fatura de "${fatura.descricao}"?`)) {
        this.$emit('excluir-fatura', fatura.id);
      }
    },
    
    formatarPeriodo(periodo) {
      if (!periodo) return '';
      const [ano, mes] = periodo.split('-');
      const meses = [
        '', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];
      return `${meses[parseInt(mes, 10)]}/${ano}`;
    }
  },
  mounted() {
    // Não precisa carregar do localStorage aqui, pois os cartões e faturas vêm como prop
  },
  computed:{
    // Retorna todas as faturas
    faturasFiltradas() {
      if (!this.periodoSelecionado) return this.faturas;
      const [anoSelecionado, mesSelecionado] = this.periodoSelecionado.split('-');
      return this.faturas.filter(fatura => {
        const [anoFatura, mesFatura] = fatura.dataVencimento.split('-');
        return anoFatura === anoSelecionado && mesFatura === mesSelecionado;
      });
    },
    
    faturasPorCartao() {
      const faturasAgrupadas = {};
      
      this.cartoes.forEach(cartao => {
        faturasAgrupadas[cartao.id] = this.faturasFiltradas.filter(fatura => fatura.cartaoId === cartao.id);
      });
      
      return faturasAgrupadas;
    },
    
    saldosPorCartao() {
      const saldos = {};
      
      this.cartoes.forEach(cartao => {
        const faturasDoCartao = this.faturasFiltradas.filter(fatura => fatura.cartaoId === cartao.id);
        const saldo = faturasDoCartao.reduce((total, fatura) => {
          return total + parseFloat(fatura.valor || 0);
        }, 0);
        saldos[cartao.id] = saldo;
      });
      
      return saldos;
    },
    
    totalFaturas() {
      return this.faturasFiltradas.reduce((total, fatura) => {
        return total + parseFloat(fatura.valor || 0);
      }, 0);
    },
  }
}

</script>

<template>
  <section class="content-section" id="faturas">
    <!-- Área fixa do topo -->
    <div class="header-section">
      <div class="d-flex justify-content-between align-items-start">
        <h3 class="titulo-section">Faturas</h3>
        <div class="d-flex align-items-center gap-2">
          <button 
            @click="toggleBalancePrivacy"
            class="btn btn-sm btn-outline-secondary"
            :title="isBalanceHidden ? 'Mostrar saldos' : 'Ocultar saldos'"
          >
            <i :class="['bi', isBalanceHidden ? 'bi-eye-fill' : 'bi-eye-slash-fill']"></i>
          </button>
        </div>
      </div>
      <Periodo @periodo-change="atualizarPeriodo" />
      <TotalCard 
        titulo="Total de Faturas"
        :valor="totalFaturas"
        :contador="faturasFiltradas.length"
        itemLabel="fatura"
        tipo="faturas"
      />
      

    </div>
    
    <!-- Área rolável dos cartões -->
    <div class="scrollable-content">
      <!-- Lista de cartões -->
      <div class="cartoes-grid" v-if="cartoes.length > 0">
      <div 
        v-for="cartao in cartoes" 
        :key="cartao.id" 
        class="cartao-card"
        :style="{ '--cartao-cor': cartao.cor }"
      >
        <div class="cartao-header">
          <div>
            <h5 class="cartao-nome">{{ cartao.nome }}</h5>
            <span class="cartao-banco">{{ cartao.banco }}</span>
            <span class="cartao-saldo">{{ formatBalanceWithPrivacy(saldosPorCartao[cartao.id]) }}</span>
          </div>

          <div class="cartao-acoes">
            <!-- Botão para expandir/recolher o cartão -->
            <button 
              class="btn btn-sm btn-outline-secondary"
              @click="expandirCartao(cartao.id)"
              :title="cartoesExpandidos.includes(cartao.id) ? 'Recolher' : 'Expandir'"
            >
              <i :class="['bi', cartoesExpandidos.includes(cartao.id) ? 'bi-chevron-up' : 'bi-chevron-down']"></i>
            </button>
            <!-- Botão para ativar modo de edição dos lançamentos (só aparece quando expandido) -->
            <button 
              v-if="cartoesExpandidos.includes(cartao.id)"
              class="btn btn-sm"
              :class="cartaoEmEdicao === cartao.id ? 'btn-warning' : 'btn-outline-warning'"
              @click="ativarModoEdicao(cartao.id)"
              :title="cartaoEmEdicao === cartao.id ? 'Sair do modo edição' : 'Editar lançamentos'"
            >
              <i class="bi bi-pencil-square"></i>
            </button>
          </div>
        </div>

        <!-- Informações do cartão -->
        <div class="cartao-info">
          <div class="info-item">
            <span class="info-label">Corte:</span>
            <span class="info-value">{{ cartao.diaCorte }}º</span>
          </div>
          <div class="info-item">
            <span class="info-label">Vencimento:</span>
            <span class="info-value">{{ cartao.diaVencimento }}º</span>
          </div>
        </div>
        
        <!-- Lista de faturas do cartão (mostra apenas se expandido) -->
        <div v-if="cartoesExpandidos.includes(cartao.id)">
          <div v-if="faturasPorCartao[cartao.id] && faturasPorCartao[cartao.id].length > 0" class="faturas-lista">
            <h6 class="faturas-titulo">Faturas:</h6>
            <div v-for="fatura in faturasPorCartao[cartao.id]" :key="fatura.id" class="fatura-item">
              <div class="fatura-info">
                <span class="fatura-descricao">{{ fatura.descricao }}</span>
                <span class="fatura-data">Venc: {{ formatarData(fatura.dataVencimento) }}</span>
              </div>
              <div class="fatura-acoes">
                <span class="fatura-valor">{{ formatCurrency(fatura.valor) }}</span>
                <!-- Controles de edição (aparecem apenas no modo de edição) -->
                <div v-if="cartaoEmEdicao === cartao.id" class="fatura-controles">
                  <button 
                    class="btn btn-sm btn-outline-primary"
                    @click="editarFatura(fatura)"
                    title="Editar fatura"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button 
                    class="btn btn-sm btn-outline-danger"
                    @click="excluirFatura(fatura)"
                    title="Excluir fatura"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="sem-faturas">
            <p class="text-muted small">Nenhuma fatura cadastrada</p>
          </div>
        </div>
        
        <!-- Indicador de faturas quando não expandido -->
        <div v-else-if="faturasPorCartao[cartao.id] && faturasPorCartao[cartao.id].length > 0" class="faturas-indicator">
          <small class="text-muted">
            <i class="bi bi-list-ul me-1"></i>
            {{ faturasPorCartao[cartao.id].length }} fatura{{ faturasPorCartao[cartao.id].length !== 1 ? 's' : '' }}
          </small>
        </div>
        
      </div>
    </div>

    <!-- Mensagem quando não há cartões -->
    <div v-else class="text-center py-5">
      <i class="bi bi-credit-card fs-1 text-muted mb-3"></i>
      <h5 class="text-muted">Nenhum cartão cadastrado</h5>
      <p class="text-muted">Clique em "Adicionar Cartão de Crédito" no Dashboard</p>
    </div>

    <!-- Mensagem quando não há faturas no período -->
    <div v-if="cartoes.length > 0 && faturasFiltradas.length === 0 && periodoSelecionado" class="text-center py-5">
      <i class="bi bi-calendar-x fs-1 text-muted mb-3"></i>
      <h5 class="text-muted">Nenhuma fatura em {{ formatarPeriodo(periodoSelecionado) }}</h5>
      <p class="text-muted">Adicione uma fatura para este período ou altere o período selecionado</p>
    </div>

      <BtnAdd tipo="fatura" @abrir-modal-fatura="abrirModalFatura"/>

      <ModalCadastraFatura 
        v-show="modalFatura"
        :cartoes="cartoes"
        :periodo="periodoSelecionado"
        @fechar-modal-fatura="fecharModalFatura"
        @adicionar-fatura="$emit('adicionar-fatura', $event)"
        @atualizar-fatura="$emit('editar-fatura', $event)"
        @remover-fatura-parcelada="$emit('remover-fatura-parcelada', $event)"
      />
    </div>
  </section>
</template>

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
  background-color: var(--card-bg);
  border-bottom: 1px solid var(--border-color);
}

.scrollable-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.cartoes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin: 0;
}

.cartao-card {
  background-color: var(--card-bg);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
  border-left: 4px solid var(--cartao-cor);
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

.cartao-banco {
  font-size: 0.9rem;
  color: #666;
  display: block;
  margin-top: 0.25rem;
}

.cartao-saldo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--cartao-cor);
  display: block;
  margin-top: 0.5rem;
}

.cartao-acoes {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
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

.faturas-indicator {
  margin-top: 0.5rem;
  padding: 0.5rem 0;
  border-top: 1px solid #eee;
}

.faturas-lista {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.faturas-titulo {
  font-size: 0.9rem;
  font-weight: 600;
  color: #555;
  margin-bottom: 0.5rem;
}

.fatura-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f5f5f5;
}

.fatura-item:last-child {
  border-bottom: none;
}

.fatura-info {
  flex-grow: 1;
  margin-right: 1rem;
}

.fatura-acoes {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.fatura-controles {
  display: flex;
  gap: 0.25rem;
}

.fatura-descricao {
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
}

.fatura-data {
  font-size: 0.75rem;
  color: #888;
  margin-left: 0.5rem;
}

.fatura-valor {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--cartao-cor);
}

.sem-faturas {
  text-align: center;
  padding: 1rem;
  color: #888;
}


</style>
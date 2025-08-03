<script>
import Cabecalho from './Cabecalho.vue';
import BtnAdd from './BtnAdd.vue';
import ModalCadastraInvestimento from './ModalCadastraInvestimento.vue';
import { useBalancePrivacy } from '../composables/useBalancePrivacy.js';
import currencyMixin from '../mixins/currencyMixin.js';
import { formatarComoMoeda } from '../utils/formatters.js';

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
  props: {
    investimentos: {
      type: Array,
      required: true
    }
  },
  data(){
    return{
      modalInvestimento: false,
      edCampoValorInicial: null,
      edCampoValorAtual: null,
      edCampoQtdAtual: null,
      edCampoDtAplicacao: null,
      edCampoDtVencimento: null,
      novaDtAplicacao: null,
      novaDtVencimento: null,
      novoQtdAtual: null,
      novoValorAtual: null,
      novoValorInicial: null,
      investimentoEmEdicao: null,
    }
  },
  components:{
    Cabecalho,
    BtnAdd,
    ModalCadastraInvestimento,
  },
  methods: {
    atualizaValorAtual(investimento, campoValor) {
      console.log(investimento.id);
      if(campoValor === 'valorInicial') {
        this.edCampoValorInicial = investimento.id;
        this.novoValorInicial = investimento.valorInicial;
      } else {
        this.edCampoValorInicial = null;
      }
      if(campoValor === 'valorAtual') {
        this.edCampoValorAtual = investimento.id;
        this.novoValorAtual = investimento.valorAtual;
      }else {
        this.edCampoValorAtual = null;
      }
      if(campoValor === 'quantidade') {
        this.edCampoQtdAtual = investimento.id;
        this.novoQtdAtual = investimento.quantidade;
      } else {
        this.edCampoQtdAtual = null;
      }
      if(campoValor === 'dataAplicacao') {
        this.edCampoDtAplicacao = investimento.id;
        this.novaDtAplicacao = investimento.dataAplicacao;
      } else {
        this.edCampoDtAplicacao = null;
      }
      if(campoValor === 'dataVencimento') {
        this.edCampoDtVencimento = investimento.id;
        this.novaDtVencimento = investimento.dataVencimento;
      } else {
        this.edCampoDtVencimento = null;
      }
    },
    confirmarEdicao(investimento, campoValor) {
      if(campoValor === 'valorInicial') {
        investimento.valorInicial = this.novoValorInicial;
        this.edCampoValorInicial = null;
      }
      if(campoValor === 'valorAtual') {
        investimento.valorAtual = this.novoValorAtual;
        this.edCampoValorAtual = null;
      } 
      if(campoValor === 'quantidade') {
        investimento.quantidade = this.novoQtdAtual;
        this.edCampoQtdAtual = null;
      }
      if(campoValor === 'dataAplicacao') {
        investimento.dataAplicacao = this.novaDtAplicacao;
        this.edCampoDtAplicacao = null;
      }
      if(campoValor === 'dataVencimento') {
        investimento.dataVencimento = this.novaDtVencimento;
        this.edCampoDtVencimento = null;
      }
      this.$emit('atualizar-investimento', investimento);

    },
    abrirModalInvestimento(){
      this.modalInvestimento = true;
    },
    fecharModalInvestimento(){
      this.modalInvestimento = false;
      this.investimentoEmEdicao = null;
    },
    editarInvestimento(investimento){
      this.investimentoEmEdicao = investimento;
      this.modalInvestimento = true;
    },
    excluirInvestimento(investimento){
      if (confirm(`Tem certeza que deseja excluir o investimento "${investimento.nome}"?`)) {
        this.$emit('excluir-investimento', investimento.id);
      }
    },
    formatarData(data) {
      if (!data) return '-';
      const [ano, mes, dia] = data.split('-');
      return `${dia}/${mes}/${ano}`;
    },
    calcularRentabilidade(investimento) {
      if (!investimento.valorAtual || !investimento.valorInicial) return 0;
      
      const valorInicial = parseFloat(investimento.valorInicial);
      const valorAtual = parseFloat(investimento.valorAtual);
      const rentabilidade = ((valorAtual - valorInicial) / valorInicial) * 100;
      
      return rentabilidade;
    },
    getRentabilidadeClass(rentabilidade) {
      if (rentabilidade > 0) return 'text-success';
      if (rentabilidade < 0) return 'text-danger';
      return 'text-muted';
    },
    getRentabilidadeIcon(rentabilidade) {
      if (rentabilidade > 0) return 'bi-arrow-up-circle-fill';
      if (rentabilidade < 0) return 'bi-arrow-down-circle-fill';
      return 'bi-dash-circle-fill';
    },
    formatarMoeda(valor){
      return formatarComoMoeda(valor);
    }
  },
  computed:{
    totalInvestido() {
      return this.investimentos.reduce((total, inv) => {
        if(inv.quantidade > 1) {
          return total + (parseFloat(inv.valorInicial || 0) * inv.quantidade);
        }else {
          return total + parseFloat(inv.valorInicial || 0);
        }
      }, 0);
    },
    valorAtualTotal() {
      return this.investimentos.reduce((total, inv) => {
        if(inv.quantidade > 1) {
          return total + (parseFloat(inv.valorAtual || 0) * inv.quantidade);
        }else {
        return total + parseFloat(inv.valorAtual || 0);
        }
      }, 0);
    },
    rentabilidadeTotal() {
      if (this.totalInvestido === 0) return 0;
      return ((this.valorAtualTotal - this.totalInvestido) / this.totalInvestido) * 100;
    }
  }
}
</script>

<template>
  <section class="content-section" id="investimentos">
    <!-- Área fixa do topo -->
    <div class="header-section">
      <div class="d-flex justify-content-between align-items-start">
        <Cabecalho titulo="Investimentos" descricao="Acompanhe suas aplicações financeiras." />
        <div class="d-flex align-items-center me-2">
          <button 
            @click="toggleBalancePrivacy"
            class="btn btn-sm btn-outline-secondary"
            :title="isBalanceHidden ? 'Mostrar valores' : 'Ocultar valores'"
          >
            <i :class="['bi', isBalanceHidden ? 'bi-eye-fill' : 'bi-eye-slash-fill']"></i>
          </button>
        </div>
      </div>

      <!-- Resumo dos Investimentos -->
      <div class="d-flex align-items-center justify-content-between header-investimentos px-3">
        <div class="col-md-2">
          <div class="card summary-card">
            <div class="summary-icon bg-primary-light">
              <i class="bi bi-wallet2 text-primary"></i>
            </div>
            <div class="summary-content">
              <h6 class="summary-label">Total Investido</h6>
              <h4 class="summary-value">{{ formatBalanceWithPrivacy(totalInvestido) }}</h4>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card summary-card">
            <div class="summary-icon bg-success-light">
              <i class="bi bi-graph-up text-success"></i>
            </div>
            <div class="summary-content">
              <h6 class="summary-label">Valor Atual</h6>
              <h4 class="summary-value">{{ formatBalanceWithPrivacy(valorAtualTotal) }}</h4>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card summary-card">
            <div class="summary-icon" :class="getRentabilidadeClass(rentabilidadeTotal) === 'text-success' ? 'bg-success-light' : getRentabilidadeClass(rentabilidadeTotal) === 'text-danger' ? 'bg-danger-light' : 'bg-muted-light'">
              <i :class="['bi', getRentabilidadeIcon(rentabilidadeTotal), getRentabilidadeClass(rentabilidadeTotal)]"></i>
            </div>
            <div class="summary-content">
              <h6 class="summary-label">Rentabilidade</h6>
              <h4 class="summary-value" :class="getRentabilidadeClass(rentabilidadeTotal)">
                {{ rentabilidadeTotal.toFixed(2) }}%
              </h4>
            </div>
          </div>
        </div>
    </div>

    </div>
    
    <!-- Área rolável dos investimentos -->
    <div class="scrollable-content">
      <!-- Lista de Investimentos -->
      <div class="investimentos-grid" v-if="investimentos.length > 0">
      <div 
        v-for="investimento in investimentos" 
        :key="investimento.id" 
        class="investimento-card"
      >
        <div class="investimento-header">
          <div>
            <h5 class="investimento-nome">{{ investimento.nome }}</h5>
            <span class="investimento-tipo">{{ investimento.tipo }}</span>
          </div>

          <div class="investimento-acoes">
            <button 
              class="btn btn-sm btn-outline-danger"
              @click="excluirInvestimento(investimento)"
              title="Excluir investimento"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>

        <div v-show="investimento.quantidade > 1" class="info-row">
          <div class="info-item">
            <span class="info-label">Quantidade:</span>
            <div v-if="edCampoQtdAtual === investimento.id" class="info-value">
              <input type="number" class="form-control" v-model="novoQtdAtual" placeholder="Quantidade" @input="edCampoQtdAtual = investimento.id">
              <button class="btn" @click="confirmarEdicao(investimento, 'quantidade')">
                <i class="bi bi-check-circle text-success"></i>
              </button>
              <button class="btn" @click="edCampoQtdAtual = null">
                <i class="bi bi-x-circle text-danger"></i>
              </button>
            </div>
            <div v-else class="info-value">
              <span class="info-value me-2">{{ investimento.quantidade }}</span>
              <button class="btn btn-pd1" @click="edCampoQtdAtual = investimento.id">
                <i class="bi bi-arrow-clockwise"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="investimento-info">
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">Valor Inicial:</span>
              <div class="info-value" v-if="edCampoValorInicial === investimento.id">
                <input class="form-control" type="text" name="" id="" v-model="novoValorInicial" @input="formatarMoeda(novoValorInicial)" placeholder="0,00">
                <button class="btn" @click="confirmarEdicao(investimento, 'valorInicial')">
                  <i class="bi bi-check-circle text-success"></i>
                </button>
                <button class="btn" @click="edCampoValorInicial = null">
                  <i class="bi bi-x-circle text-danger"></i>
                </button>
              </div>
              <div v-else class="info-value d-flex flex-column justify-content-between">
                <div>
                  <span class="info-value me-2">{{ formatBalanceWithPrivacy(investimento.valorInicial)}}</span>
                  <button class="btn btn-pd1" @click="atualizaValorAtual(investimento, 'valorInicial')">
                    <i class="bi bi-pencil"></i>
                  </button>
                </div>
                <div v-if="investimento.quantidade > 1" class="text-muted small">
                  <span class="info-label">Total</span>
                  {{ formatBalanceWithPrivacy(investimento.valorInicial * investimento.quantidade) }}

                </div>

              </div>
            </div>
            <div class="info-item">
              <span class="info-label">Valor Atual:</span>
              <div class="info-value" v-if="edCampoValorAtual === investimento.id">
                <input type="text" class="form-control" v-model="novoValorAtual" @input="formatarMoeda(novoValorAtual)" placeholder="0,00">
                <button class="btn" @click="confirmarEdicao(investimento, 'valorAtual')">
                  <i class="bi bi-check-circle text-success"></i>
                </button>
                <button class="btn" @click="edCampoValorAtual = null">
                  <i class="bi bi-x-circle text-danger"></i>
                </button>
              </div>
              <div v-else class="info-value d-flex flex-column justify-content-between">
                <div>
                  <span class="info-value me-2">{{ formatBalanceWithPrivacy(investimento.valorAtual) }}</span>
                  <button class="btn btn-pd1" @click="atualizaValorAtual(investimento, 'valorAtual')">
                    <i class="bi bi-arrow-clockwise"></i>
                  </button>
                </div>
                <div v-if="investimento.quantidade > 1" class="text-muted small">
                <span class="info-label">Total</span>
                {{ formatBalanceWithPrivacy(investimento.valorAtual * investimento.quantidade) }}
              </div>
              </div>
            </div>
          </div>
          
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">Banco/Instituição:</span>
              <span class="info-value">{{ investimento.banco || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Data de Aplicação:</span>
              <div v-if="edCampoDtAplicacao === investimento.id" class="info-value">
                <input type="date" class="form-control" v-model="novaDtAplicacao">
                <button class="btn" @click="confirmarEdicao(investimento, 'dataAplicacao')">
                  <i class="bi bi-check-circle text-success"></i>
                  </button>
                <button class="btn" @click="edCampoDtAplicacao = null">
                  <i class="bi bi-x-circle text-danger"></i>
                </button>
              </div>
              <div v-else class="info-value">
                <span class="info-value me-2">{{ formatarData(investimento.dataAplicacao) }}</span> 
                <button class="btn btn-pd1" @click="edCampoDtAplicacao = investimento.id">
                  <i class="bi bi-pencil"></i>
                </button>  
              </div>
            </div>
          </div>

          <div class="info-row">
            <div class="info-item">
              <span class="info-label">Vencimento:</span>
              <div v-if="edCampoDtVencimento === investimento.id" class="info-value">
                <input type="date" class="form-control" v-model="novaDtVencimento">
                <button class="btn" @click="confirmarEdicao(investimento, 'dataVencimento')">
                  <i class="bi bi-check-circle text-success"></i>
                </button>
                <button class="btn" @click="edCampoDtVencimento = null">
                  <i class="bi bi-x-circle text-danger"></i>
                </button>
              </div>
              <div v-else class="info-value">
                <span class="info-value">{{ formatarData(investimento.dataVencimento) }}</span>
                <button class="btn btn-pd1" @click="edCampoDtVencimento = investimento.id">
                  <i class="bi bi-pencil"></i>
                </button>
              </div>
            </div>
            <div class="info-item">
              <!-- Espaço reservado para futuras informações -->
            </div>
          </div>

          <div class="rentabilidade-info">
            <span class="rentabilidade-label">Rentabilidade:</span>
            <span 
              class="rentabilidade-value" 
              :class="getRentabilidadeClass(calcularRentabilidade(investimento))"
            >
              <i :class="['bi', getRentabilidadeIcon(calcularRentabilidade(investimento))]"></i>
              {{ calcularRentabilidade(investimento).toFixed(2) }}%
            </span>
          </div>
        </div>

        <div v-if="investimento.observacoes" class="investimento-observacoes">
          <small class="text-muted">{{ investimento.observacoes }}</small>
        </div>
      </div>
    </div>

    <!-- Mensagem quando não há investimentos -->
    <div v-else class="text-center py-5">
      <i class="bi bi-graph-up fs-1 text-muted mb-3"></i>
      <h5 class="text-muted">Nenhum investimento cadastrado</h5>
      <p class="text-muted">Clique em "Adicionar Investimento" para começar</p>
    </div>

      <BtnAdd tipo="investimento" @abrir-modal-investimento="abrirModalInvestimento"/>

      <ModalCadastraInvestimento 
        v-show="modalInvestimento"
        :investimento="investimentoEmEdicao"
        @fechar-modal-investimento="fecharModalInvestimento"
        @adicionar-investimento="$emit('adicionar-investimento', $event)"
        @atualizar-investimento="$emit('editar-investimento', $event)"
      />
    </div>
  </section>
</template>

<style scoped>
.header-investimentos {
  position: relative;
  overflow-x: auto;
  white-space: nowrap;
  gap: 1rem;
  box-shadow: var(--card-shadow);
}
.scrollable-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  height: 75vh;
}

.investimentos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin: 0;
}

.investimento-card {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--card-shadow);
  border: 1px solid var(--card-border);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.investimento-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.investimento-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.investimento-nome {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
}

.investimento-tipo {
  font-size: 0.875rem;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  display: inline-block;
  margin-top: 0.25rem;
}

.investimento-acoes {
  display: flex;
  gap: 0.5rem;
}

.investimento-info {
  margin-bottom: 1rem;
}

.info-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.info-item {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.info-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}

.rentabilidade-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  margin-top: 0.5rem;
}

.rentabilidade-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.rentabilidade-value {
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.investimento-observacoes {
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

/* Cards de resumo */
.summary-card {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 12px;
  box-shadow: var(--card-shadow);
  border: 1px solid var(--card-border);
  background: var(--card-bg);
}

.summary-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.6rem;
}

.summary-icon i {
  font-size: 0.9rem;
}

.summary-content {
  flex: 1;
}

.summary-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin: 0;
  font-weight: 500;
}

.summary-value {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-primary);
}

.bg-primary-light {
  background-color: rgba(0, 123, 255, 0.1);
}

.bg-success-light {
  background-color: rgba(40, 167, 69, 0.1);
}

.bg-danger-light {
  background-color: rgba(220, 53, 69, 0.1);
}

.bg-muted-light {
  background-color: rgba(108, 117, 125, 0.1);
}

.text-primary {
  color: var(--primary-color) !important;
}

.text-success {
  color: var(--success-color) !important;
}

.text-danger {
  color: var(--danger-color) !important;
}

.text-muted {
  color: var(--text-muted) !important;
}

@media (max-width: 768px) {
  .investimentos-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .info-row {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .summary-card {
    margin-bottom: 1rem;
  }
}
</style>
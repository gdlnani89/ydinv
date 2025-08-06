<template>
  <section class="content-section" id="dividas">
    <!-- Área fixa do topo -->
    <div class="pb-2 bx-shadow sticky-top bg-white">
      <div class="d-flex justify-content-between align-items-center py-2 px-3">
        <h4>Dívidas</h4>
        <div class="d-flex align-items-center gap-2">
          <button 
            @click="toggleBalancePrivacy"
            class="btn btn-sm btn-outline-secondary"
            :title="isBalanceHidden ? 'Mostrar valores' : 'Ocultar valores'"
          >
            <i :class="['bi', isBalanceHidden ? 'bi-eye-fill' : 'bi-eye-slash-fill']"></i>
          </button>
        </div>
      </div>

      <!-- Resumo das Dívidas -->
      <div class="d-flex align-items-center justify-content-between header-operacao px-3">
        <div class="col-md-4">
          <div class="card summary-card">
            <div class="summary-icon bg-danger-light">
              <i class="bi bi-exclamation-triangle text-danger"></i>
            </div>
            <div class="summary-content">
              <h6 class="summary-label">Total de Dívidas</h6>
              <h4 class="summary-value">{{ formatBalanceWithPrivacy(totalDividas) }}</h4>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card summary-card">
            <div class="summary-icon bg-success-light">
              <i class="bi bi-check-circle text-success"></i>
            </div>
            <div class="summary-content">
              <h6 class="summary-label">Valor Atual</h6>
              <h4 class="summary-value">{{ formatBalanceWithPrivacy(valorAtualTotal) }}</h4>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card summary-card">
            <div class="summary-icon bg-warning-light">
              <i class="bi bi-clock text-warning"></i>
            </div>
            <div class="summary-content">
              <h6 class="summary-label">Valor Restante</h6>
              <h4 class="summary-value">{{ formatBalanceWithPrivacy(valorRestanteTotal) }}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Área rolável das dívidas -->
    <div class="scrollable-content">
      <!-- Lista de Dívidas -->
      <div class="dividas-grid" v-if="dividas.length > 0">
        <div 
          v-for="divida in dividas" 
          :key="divida.id" 
          class="divida-card"
        >
          <div class="divida-header">
            <div>
              <h5 class="divida-nome">{{ divida.nome }}</h5>
              <span class="divida-tipo">{{ divida.tipo }}</span>
            </div>
            <div class="divida-acoes">
              <!-- <button 
                class="btn btn-sm btn-outline-success"
                @click="atualizarValorDivida(divida)"
                title="Atualizar valor atual"
              >
                <i class="bi bi-arrow-clockwise"></i>
              </button>
              <button 
                class="btn btn-sm btn-outline-primary"
                @click="editarDivida(divida)"
                title="Editar dívida"
              >
                <i class="bi bi-pencil"></i>
              </button> -->
              <button 
                class="btn btn-sm btn-outline-danger"
                @click="excluirDivida(divida)"
                title="Excluir dívida"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>

          <div class="divida-info">
            <div class="info-row">
              <CampoEditavel
                :label="'Valor Inicial'"
                :valor="Number(divida.valorInicial)"
                :quantidade="1"
                :editando="edCampoValorInicial === divida.id"
                @editar="edCampoValorInicial = divida.id"
                @cancelar="edCampoValorInicial = null"
                @confirmar="valor => confirmarEdicao(divida, 'valorInicial',valor, 'edCampoValorInicial')"
                nomeCampo="valorInicial"
                />

              <CampoEditavel
                :label="'Valor Atual'"
                :valor="Number(divida.valorAtual)"
                :quantidade="1"
                :editando="edCampoValorAtual === divida.id"
                @editar="edCampoValorAtual = divida.id"
                @cancelar="edCampoValorAtual = null"
                @confirmar="valor => confirmarEdicao(divida, 'valorAtual', valor, 'edCampoValorAtual')"
                nomeCampo="valorAtual"
                />
            </div>
            
            <div class="info-row">
              <div class="info-item">
                <span class="info-label">Credor:</span>
                <span class="info-value">{{ divida.credor || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Vencimento:</span>
                <span class="info-value">{{ formatarData(divida.dataVencimento) }}</span>
              </div>
            </div>

            <!-- Barra de Progresso -->
            <div class="progresso-info">
              <div class="progresso-header">
                <span class="progresso-label">Progresso do Pagamento</span>
                <span class="progresso-percentual">{{ calcularPercentualPago(divida) }}%</span>
              </div>
              <div class="progresso-barra">
                <div 
                  class="progresso-preenchimento" 
                  :style="{ width: calcularPercentualPago(divida) + '%' }"
                ></div>
              </div>
              <div class="progresso-valores">
                <span class="valor-restante">Restante: {{ formatBalanceWithPrivacy(calcularValorRestante(divida)) }}</span>
              </div>
            </div>
          </div>

          <div v-if="divida.observacoes" class="divida-observacoes">
            <small class="text-muted">{{ divida.observacoes }}</small>
          </div>
        </div>
      </div>
      

      <!-- Mensagem quando não há dívidas -->
      <div v-else class="text-center py-5">
        <i class="bi bi-check-circle fs-1 text-success mb-3"></i>
        <h5 class="text-muted">Nenhuma dívida cadastrada</h5>
        <p class="text-muted">Clique em "Adicionar Dívida" para começar</p>
      </div>

      <BtnAdd tipo="divida" @abrir-modal-divida="abrirModalDivida"/>

      <ModalCadastraDivida 
        v-show="modalDivida"
        :divida="dividaEmEdicao"
        @fechar-modal-divida="fecharModalDivida"
        @adicionar-divida="$emit('adicionar-divida', $event)"
        @atualizar-divida="$emit('editar-divida', $event)"
      />

  
    </div>

  </section>
</template>

<script>
import CampoEditavel from './CampoEditavel.vue';
import BtnAdd from './BtnAdd.vue';
import ModalCadastraDivida from './ModalCadastraDivida.vue';
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
  props: ['dividas'],
  data(){
    return{
      modalDivida: false,
      dividaEmEdicao: null,
      mostrarModalAtualizacao: false,
      dividaAtualizando: null,
      novoValorAtual: '',
      edCampoValorAtual: null,
      edCampoValorInicial: null,
      edCampoDtVencimento: null,
      novaDtVencimento: null,
      novoValorAtual: null,
      novoValorInicial: null,
    }
  },
  components:{
    BtnAdd,
    ModalCadastraDivida,
    CampoEditavel
  },
  methods: {
    abrirModalDivida(){
      this.modalDivida = true;
    },
    fecharModalDivida(){
      this.modalDivida = false;
      this.dividaEmEdicao = null;
    },
    editarDivida(divida){
      this.dividaEmEdicao = divida;
      this.modalDivida = true;
    },
    excluirDivida(divida){
      if (confirm(`Tem certeza que deseja excluir a dívida "${divida.nome}"?`)) {
        this.$emit('excluir-divida', divida.id);
      }
    },
    formatarData(data) {
      if (!data) return '-';
      const [ano, mes, dia] = data.split('-');
      return `${dia}/${mes}/${ano}`;
    },
    calcularPercentualPago(divida) {
      if (!divida.valorInicial || divida.valorInicial <= 0) return 0;
      const valorInicial = parseFloat(divida.valorInicial);
      const valorAtual = parseFloat(divida.valorAtual || 0);
      const valorPago = valorInicial - valorAtual;
      return Math.min(100, Math.round((valorPago / valorInicial) * 100));
    },
    calcularValorRestante(divida) {
      const valorAtual = parseFloat(divida.valorAtual || 0);
      return valorAtual;
    },
    // atualizarValorDivida(divida) {
    //   this.dividaAtualizando = divida;
    //   this.novoValorAtual = parseFloat(divida.valorAtual).toLocaleString('pt-BR', {
    //     minimumFractionDigits: 2,
    //     maximumFractionDigits: 2,
    //   });
    //   this.mostrarModalAtualizacao = true;
    // },
    confirmarEdicao(divida, campo, valor, campoValor) {
      divida[campo] = valor;
      this.$emit('atualizar-divida', divida);
      this[campoValor] = null;
      
    },
    confirmarAtualizacao() {
      if (!this.novoValorAtual || this.novoValorAtual === '0,00') {
        alert('Por favor, digite um valor válido');
        return;
      }
      
      const valorNumerico = parseFloat(this.novoValorAtual.replace(/\D/g, '')) / 100 || 0;
      if (valorNumerico <= 0) {
        alert('Por favor, digite um valor válido');
        return;
      }
      
      if (valorNumerico > parseFloat(this.dividaAtualizando.valorInicial)) {
        alert('O valor atual não pode ser maior que o valor inicial');
        return;
      }
      
      const dividaAtualizada = {
        ...this.dividaAtualizando,
        valorAtual: valorNumerico.toString()
      };
      
      this.$emit('editar-divida', dividaAtualizada);
      this.fecharModalAtualizacao();
    },
    
    // fecharModalAtualizacao() {
    //   this.mostrarModalAtualizacao = false;
    //   this.dividaAtualizando = null;
    //   this.novoValorAtual = '';
    // },
    
    formatarComoMoeda(e) {
      if (!e || !e.target) return;
      
      // Remove tudo que não é número
      let valorApenasDigitos = e.target.value.replace(/\D/g, '');

      if (!valorApenasDigitos) {
        this.novoValorAtual = '0,00';
        return;
      }

      const valorNumerico = Number(valorApenasDigitos) / 100;

      this.novoValorAtual = valorNumerico.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  },
  computed:{
    totalDividas() {
      return this.dividas.reduce((total, div) => {
        return total + parseFloat(div.valorInicial || 0);
      }, 0);
    },
    valorAtualTotal() {
      return this.dividas.reduce((total, div) => {
        return total + parseFloat(div.valorAtual || 0);
      }, 0);
    },
    valorRestanteTotal() {
      return this.valorAtualTotal;
    }
  }
}
</script>

<style scoped>
.header-section {
  flex-shrink: 0;
  padding: 0.75rem;
  background: white;
  border-bottom: 1px solid #e9ecef;
}

.dividas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin: 0;
}

.divida-card {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--card-shadow);
  border: 1px solid var(--card-border);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.divida-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.divida-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.divida-nome {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
}

.divida-tipo {
  font-size: 0.875rem;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  display: inline-block;
  margin-top: 0.25rem;
}

.divida-acoes {
  display: flex;
  gap: 0.5rem;
}

.divida-info {
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

.progresso-info {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
}

.progresso-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.progresso-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.progresso-percentual {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.progresso-barra {
  width: 100%;
  height: 8px;
  background: var(--border-color);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progresso-preenchimento {
  height: 100%;
  background: linear-gradient(90deg, var(--success-color), var(--primary-color));
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progresso-valores {
  text-align: right;
}

.valor-restante {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.divida-observacoes {
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
  transition: transform 0.2s ease;
}

.summary-card:hover {
  transform: translateY(-2px);
}

.summary-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.6rem;
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
  color: var(--text-primary);
  margin: 0;
}

/* Cores de fundo para os ícones */
.bg-danger-light {
  background: rgba(220, 53, 69, 0.1);
}

.bg-success-light {
  background: rgba(40, 167, 69, 0.1);
}

.bg-warning-light {
  background: rgba(255, 193, 7, 0.1);
}

.bg-primary-light {
  background: rgba(0, 123, 255, 0.1);
}

.bg-muted-light {
  background: rgba(108, 117, 125, 0.1);
}

/* Modal de Atualização */
.fundo-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--modal-bg);
  z-index: 1000;
}

.modal-atualizacao {
  background: var(--modal-content-bg);
  border-radius: 12px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-atualizacao .card-title {
  margin-bottom: 1rem;
  color: var(--text-primary);
  font-weight: 600;
}

.modal-atualizacao .form-label {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.modal-atualizacao .form-control {
  border: 1px solid var(--input-border);
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 1rem;
  background-color: var(--input-bg);
  color: var(--text-primary);
  transition: border-color 0.2s ease;
}

.modal-atualizacao .form-control:focus {
  outline: none;
  border-color: var(--input-focus-border);
  box-shadow: var(--input-focus-shadow);
}

.modal-atualizacao .btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-atualizacao .btn-primary {
  background-color: var(--btn-primary-bg);
  color: var(--btn-primary-text);
}

.modal-atualizacao .btn-primary:hover {
  background-color: var(--primary-color);
  transform: translateY(-1px);
}

.modal-atualizacao .btn-secondary {
  background-color: var(--btn-secondary-bg);
  color: var(--btn-secondary-text);
}

.modal-atualizacao .btn-secondary:hover {
  background-color: var(--secondary-color);
  transform: translateY(-1px);
}

/* Responsividade */
@media (max-width: 768px) {
  .dividas-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .summary-card {
    margin-bottom: 1rem;
  }
  
  .info-row {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
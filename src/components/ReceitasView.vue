<script>
import Cabecalho from './Cabecalho.vue';
import BtnAdd from './BtnAdd.vue';
import ModalCadastraReceita from './ModalCadastraReceita.vue';
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
  props: ['contas', 'receitas'],
  data(){
    return{
      modalReceita: false,
      dia: new Date().getDate(), // já começa com o dia atual
      contasExpandidas: [], // Array para controlar quais contas estão expandidas
      contaEmEdicao: null, // Controla qual conta está em modo de edição
      periodoSelecionado: '',
    }
  },
  components:{
    Cabecalho,
    BtnAdd,
    ModalCadastraReceita,
    TotalCard,
    Periodo,
  },
  methods: {
    abrirModalReceita(){
      this.modalReceita = true;
    },
    fecharModalReceita(){
      this.modalReceita = false;
    },
    formatarData(data) {
      // Formata a data de forma segura (evita problemas de fuso horário)
      const [ano, mes, dia] = data.split('-');
      return `${dia}/${mes}/${ano}`;
    },

    
    ativarModoEdicao(contaId) {
      // Ativa o modo de edição para uma conta específica
      if (this.contaEmEdicao === contaId) {
        this.contaEmEdicao = null; // Desativa o modo de edição
      } else {
        this.contaEmEdicao = contaId; // Ativa o modo de edição
      }
    },
    
    expandirConta(contaId) {
      // Alterna o estado de expansão da conta
      if (this.contasExpandidas.includes(contaId)) {
        this.contasExpandidas = this.contasExpandidas.filter(id => id !== contaId);
      } else {
        this.contasExpandidas.push(contaId);
      }
    },
    
    editarReceita(receita) {
      // Emite evento para editar a receita
      this.$emit('editar-receita', receita);
    },
    
    excluirReceita(receita) {
      if (confirm(`Tem certeza que deseja excluir a receita "${receita.descricao}"?`)) {
        // Emite evento para excluir a receita
        this.$emit('excluir-receita', receita.id);
      }
    },
    atualizarPeriodo(novoPeriodo) {
      this.periodoSelecionado = novoPeriodo;
    },
  },
  mounted() {
    // Não precisa mais carregar do localStorage aqui, pois as receitas vêm como prop
  },
  computed:{
    // Retorna todas as receitas
    receitasFiltradas() {
      if (!this.periodoSelecionado) return this.receitas;

      const [anoSelecionado, mesSelecionado] = this.periodoSelecionado.split('-')
      
      return this.receitas.filter(receita => {
        const [anoDespesa, mesDespesa] = receita.data.split('-')
        return anoDespesa === anoSelecionado && mesDespesa === mesSelecionado
      });
    },
    
    receitasPorConta() {
      const receitasAgrupadas = {};
      
      this.contas.forEach(conta => {
        receitasAgrupadas[conta.id] = this.receitasFiltradas.filter(receita => receita.contaId === conta.id);
      });
      
      return receitasAgrupadas;
    },
    saldosPorConta() {
      const saldos = {};
      
      this.contas.forEach(conta => {
        const receitasDaConta = this.receitasFiltradas.filter(receita => receita.contaId === conta.id);
        const saldo = receitasDaConta.reduce((total, receita) => {
          return total + this.safeParseFloat(receita.valor);
        }, 0);
        saldos[conta.id] = saldo;
      });
      
      return saldos;
    },
    
    totalReceitas() {
      return this.receitasFiltradas.reduce((total, receita) => {
        return total + this.safeParseFloat(receita.valor);
      }, 0);
    },
  }
}

</script>
<template>
  <section class="content-section" id="receitas">
    <!-- Área fixa do topo -->
    <div class="pb-2 bx-shadow sticky-top bg1">
      <div class="d-flex justify-content-between align-items-center py-2 px-3 bx-shadow mb-3">
          <h4>Receitas</h4>
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
      <Periodo v-model="periodoSelecionado" @periodo-selecionado="atualizarPeriodo" />
      <!-- Total de receitas -->
      <TotalCard 
        class="m-3"
        titulo="Total de Receitas"
        :valor="totalReceitas"
        :contador="receitasFiltradas.length"
        itemLabel="receita"
        tipo="receitas"
      />
    </div>
    
    <!-- Área rolável das contas -->
    <div class="scrollable-content">
    <!-- Lista de contas -->
    <div class="contas-grid" v-if="contas.length > 0">
      <div 
        v-for="conta in contas" 
        :key="conta.id" 
        class="conta-card bg1"
        :style="{ '--conta-cor': conta.cor }"
      >
        <div class="conta-header">
          <div>
          <h5 class="conta-nome">{{ conta.nome }}</h5>
            <span class="conta-saldo">{{ formatBalanceWithPrivacy(saldosPorConta[conta.id]) }}</span>
          </div>

          <div class="conta-acoes">
            <!-- Botão para expandir/recolher a conta -->
            <button 
              class="btn btn-sm btn-outline-secondary"
              @click="expandirConta(conta.id)"
              :title="contasExpandidas.includes(conta.id) ? 'Recolher' : 'Expandir'"
            >
              <i :class="['bi', contasExpandidas.includes(conta.id) ? 'bi-chevron-up' : 'bi-chevron-down']"></i>
            </button>
            <!-- Botão para ativar modo de edição dos lançamentos (só aparece quando expandido) -->
            <button 
              v-if="contasExpandidas.includes(conta.id)"
              class="btn btn-sm"
              :class="contaEmEdicao === conta.id ? 'btn-warning' : 'btn-outline-warning'"
              @click="ativarModoEdicao(conta.id)"
              :title="contaEmEdicao === conta.id ? 'Sair do modo edição' : 'Editar lançamentos'"
            >
              <i class="bi bi-pencil-square"></i>
            </button>
          </div>
        </div>
        
        <!-- Lista de receitas da conta (mostra apenas se expandida) -->
        <div v-if="contasExpandidas.includes(conta.id)">
        <div v-if="receitasPorConta[conta.id] && receitasPorConta[conta.id].length > 0" class="receitas-lista">
          <h6 class="receitas-titulo">Receitas:</h6>
          <div v-for="receita in receitasPorConta[conta.id]" :key="receita.id" class="receita-item">
            <div class="receita-info">
              <span class="receita-descricao">{{ receita.descricao }}</span>
              <span class="receita-data">{{ formatarData(receita.data) }}</span>
            </div>
            <div class="receita-acoes">
              <span class="receita-valor">{{ formatCurrency(receita.valor) }}</span>
              <!-- Controles de edição (aparecem apenas no modo de edição) -->
              <div v-if="contaEmEdicao === conta.id" class="receita-controles">
                <button 
                  class="btn btn-sm btn-outline-primary"
                  @click="editarReceita(receita)"
                  title="Editar receita"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button 
                  class="btn btn-sm btn-outline-danger"
                  @click="excluirReceita(receita)"
                  title="Excluir receita"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="sem-receitas">
          <p class="text-muted small">Nenhuma receita cadastrada</p>
          </div>
        </div>
        
        <!-- Indicador de receitas quando não expandida -->
        <div v-else-if="receitasPorConta[conta.id] && receitasPorConta[conta.id].length > 0" class="receitas-indicator">
          <small class="text-muted">
            <i class="bi bi-list-ul me-1"></i>
            {{ receitasPorConta[conta.id].length }} receita{{ receitasPorConta[conta.id].length !== 1 ? 's' : '' }}
          </small>
        </div>
        
      </div>
    </div>

    <!-- Mensagem quando não há contas -->
    <div v-else class="text-center py-5">
      <i class="bi bi-bank fs-1 text-muted mb-3"></i>
      <h5 class="text-muted">Nenhuma conta cadastrada</h5>
      <p class="text-muted">Clique em "Adicionar Conta" para começar</p>
    </div>



    <BtnAdd @abrir-modal-receita="abrirModalReceita"/>

    <ModalCadastraReceita 
      v-show="modalReceita"
      :contas="contas"
      :periodo="periodoSelecionado"
      @fechar-modal-receita="fecharModalReceita"
        @adicionar-receita="$emit('adicionar-receita', $event)"
    />
    </div>
  </section>
</template>

<style scoped>
/* .content-section {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
} */

/* .header-section {
  flex-shrink: 0;
  padding: 0.75rem;
  background: white;
  border-bottom: 1px solid #e9ecef;
} */
/* 
.scrollable-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
} */

.contas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin: 0;
}

.conta-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
  border-left: 4px solid var(--conta-cor);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
}

.conta-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.conta-header {
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  position: relative;
}

.conta-nome {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.conta-saldo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--conta-cor);
  display: block;
  margin-top: 0.5rem;
}

.conta-acoes {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.receitas-indicator {
  margin-top: 0.5rem;
  padding: 0.5rem 0;
  border-top: 1px solid #eee;
}

.receitas-lista {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.receitas-titulo {
  font-size: 0.9rem;
  font-weight: 600;
  color: #555;
  margin-bottom: 0.5rem;
}

.receita-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f5f5f5;
}

.receita-item:last-child {
  border-bottom: none;
}

.receita-info {
  flex-grow: 1;
  margin-right: 1rem;
}

.receita-acoes {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.receita-controles {
  display: flex;
  gap: 0.25rem;
}

.receita-descricao {
  font-size: 0.9rem;
  color: #333;
  font-weight: 500;
}

.receita-data {
  font-size: 0.75rem;
  color: #888;
  margin-left: 0.5rem;
}

.receita-valor {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--conta-cor);
}

.sem-receitas {
  text-align: center;
  padding: 1rem;
  color: #888;
}


</style>
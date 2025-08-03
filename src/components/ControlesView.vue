<script>
import ModalCadastraLancamento from './ModalCadastraLancamento.vue';
import { formatCurrency } from '../utils/formatters.js';
import ModalCadastraControle from './ModalCadastraControle.vue';
import ModalGerenciaControles from './ModalGerenciaControles.vue';
import { markRaw } from 'vue';

export default{
  data(){
    return{
      nomeControle : '',
      valorPadrao: '',
      descricao: '',
      listaControles: JSON.parse(localStorage.getItem('controles') || '[]'),
      listaLancamentos: JSON.parse(localStorage.getItem('lancamentosControle') || '[]'),
      valorLancamento: '',
      dataLancamento: '',
      descricaoLancamento: '',
      modalLancamentoAberto: false,
      controleSelecionado: null,
      lancamentoEditando: null,
      modalControleAberto: false,
      dropdownAberto: false,
      dropdownsAbertos: {},
      controlesEmEdicao: {},
      controlesExpandidos: {},
      modalGerenciaControlesAberto: false,
      controleEditando: null,
    }
  },
  watch: {
    listaControles: {
      handler(val) {
        localStorage.setItem('controles', JSON.stringify(val));
      },
      deep: true
    },
    listaLancamentos: {
      handler(val) {
        localStorage.setItem('lancamentosControle', JSON.stringify(val));
      },
      deep: true
    }
  },
  computed: {
    somaLancamentosPorControle() {
      // Retorna um objeto: { [idControle]: soma }
      const soma = {};
      this.listaControles.forEach(controle => {
        soma[controle.id] = this.listaLancamentos
          .filter(l => l.idControle === controle.id)
          .reduce((acc, l) => acc + Number(l.valor || 0), 0);
      });
      return soma;
    },
    somaPagosPorControle() {
      // Soma apenas os lançamentos pagos
      const soma = {};
      this.listaControles.forEach(controle => {
        soma[controle.id] = this.listaLancamentos
          .filter(l => l.idControle === controle.id && l.pago)
          .reduce((acc, l) => acc + Number(l.valor || 0), 0);
      });
      return soma;
    },
    somaSelecionadaPorControle() {
      // Retorna um objeto: { [idControle]: soma }
      const soma = {};
      this.listaControles.forEach(controle => {
        soma[controle.id] = this.listaLancamentos
          .filter(l => l.idControle === controle.id && l.soma)
          .reduce((acc, l) => acc + Number(l.valor || 0), 0);
      });
      return soma;
    },
    quantidadeLancamentosPorControle() {
      // Retorna um objeto: { [idControle]: quantidade }
      const qtd = {};
      this.listaControles.forEach(controle => {
        qtd[controle.id] = this.listaLancamentos.filter(l => l.idControle === controle.id).length;
      });
      return qtd;
    },
  },
  methods:{
    addControle(controle){
      if (this.controleEditando && this.controleEditando.id) {
        // Edição: atualizar o controle existente
        const idx = this.listaControles.findIndex(c => c.id === this.controleEditando.id);
        if (idx !== -1) {
          this.listaControles.splice(idx, 1, {
            ...this.controleEditando,
            ...controle,
            id: this.controleEditando.id
          });
        }
        this.controleEditando = null;
      } else {
        // Novo controle
        const idNow = Date.now();
        const novoControle = {
          id : idNow,
          nome : controle.nome,
          valorPadrao : controle.valorPadrao,
          descricao : controle.descricao
        };
        this.listaControles.push(novoControle);
      }
    },
    abrirModalLancamento(controle) {
      this.controleSelecionado = controle;
      this.lancamentoEditando = null;
      this.modalLancamentoAberto = true;
    },
    abrirModalEditarLancamento(controle, lancamento) {
      this.controleSelecionado = controle;
      this.lancamentoEditando = { ...lancamento };
      this.modalLancamentoAberto = true;
    },
    fecharModalLancamento() {
      this.modalLancamentoAberto = false;
      this.controleSelecionado = null;
      this.lancamentoEditando = null;
    },
    salvarLancamentoNoControle(lancamentos) {
      if (!Array.isArray(lancamentos)) lancamentos = [lancamentos];
      lancamentos.forEach(lancamento => {
        lancamento.idControle = this.controleSelecionado.id;
        if(typeof lancamento.soma === 'undefined') lancamento.soma = false; // Garante que soma esteja definida
        if (this.lancamentoEditando) {
          // Atualizar lançamento existente
          const idx = this.listaLancamentos.findIndex(l => l.id === this.lancamentoEditando.id);
          if (idx !== -1) {
            this.listaLancamentos.splice(idx, 1, { ...lancamento, id: this.lancamentoEditando.id });
          }
        } else {
          // Novo lançamento
          lancamento.id = Date.now() + Math.floor(Math.random() * 10000); // Garante id único mesmo em lote
          this.listaLancamentos.push(lancamento);
        }
      });
      this.fecharModalLancamento();
    },
    marcarPago(lancamento) {
      lancamento.pago = !lancamento.pago;
      this.listaLancamentos = [...this.listaLancamentos];
    },
    marcarSoma(lancamento) {
      lancamento.soma = !lancamento.soma;
      this.listaLancamentos = [...this.listaLancamentos]; // força reatividade
    },
    formatCurrency,
    abrirModalControle() {
      this.modalControleAberto = true;
    },
    fecharModalControle() {
      this.modalControleAberto = false;
      this.controleEditando = null;
    },
    toggleDropdown() {
      this.dropdownAberto = !this.dropdownAberto;
    },
    exportarControles() {
      const dados = {
        controles: this.listaControles,
        lancamentos: this.listaLancamentos
      };
      const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `controles_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      this.dropdownAberto = false;
    },
    limparControles() {
      if (confirm('Tem certeza que deseja limpar todos os controles e lançamentos? Esta ação não pode ser desfeita.')) {
        this.listaControles = [];
        this.listaLancamentos = [];
        this.dropdownAberto = false;
      }
    },
    toggleDropdownControle(controleId) {
      this.dropdownsAbertos[controleId] = !this.dropdownsAbertos[controleId];
      // Força a reatividade
      this.dropdownsAbertos = { ...this.dropdownsAbertos };
    },
    editarControle(controle) {
      this.controlesEmEdicao[controle.id] = !this.controlesEmEdicao[controle.id];
      this.controlesEmEdicao = { ...this.controlesEmEdicao };
      this.dropdownsAbertos[controle.id] = false;
      this.dropdownsAbertos = { ...this.dropdownsAbertos };
    },
    excluirLancamento(lancamento) {
      if (confirm(`Tem certeza que deseja excluir este lançamento?`)) {
        const idx = this.listaLancamentos.findIndex(l => l.id === lancamento.id);
        if (idx !== -1) {
          this.listaLancamentos.splice(idx, 1);
        }
      }
    },
    pagarTodosLancamentos(controle) {
      if (confirm(`Limpar todos os lançamentos de "${controle.nome}"? Esta ação não pode ser desfeita.`)) {
        this.listaLancamentos = this.listaLancamentos.filter(lancamento => lancamento.idControle !== controle.id);
        this.dropdownsAbertos[controle.id] = false;
        this.dropdownsAbertos = { ...this.dropdownsAbertos };
      }
    },
    excluirControle(controle) {
      if (confirm(`Tem certeza que deseja excluir o controle "${controle.nome}" e todos os seus lançamentos?`)) {
        // Remove o controle
        this.listaControles = this.listaControles.filter(c => c.id !== controle.id);
        // Remove os lançamentos relacionados
        this.listaLancamentos = this.listaLancamentos.filter(l => l.idControle !== controle.id);
        // Remove o estado do dropdown
        delete this.dropdownsAbertos[controle.id];
        this.dropdownsAbertos = { ...this.dropdownsAbertos };
      }
    },
    expandirControle(controleId) {
      this.controlesExpandidos[controleId] = !this.controlesExpandidos[controleId];
      this.controlesExpandidos = { ...this.controlesExpandidos };
    },
    abrirModalGerenciaControles() {
      this.modalGerenciaControlesAberto = true;
    },
    fecharModalGerenciaControles() {
      this.modalGerenciaControlesAberto = false;
    },
    editarControleViaModal(controle) {
      this.fecharModalGerenciaControles();
      this.controleEditando = { ...controle };
      this.modalControleAberto = true;
    },
    excluirControleViaModal(controle) {
      if (confirm(`Tem certeza que deseja excluir o controle "${controle.nome}" e todos os seus lançamentos?`)) {
        this.listaControles = this.listaControles.filter(c => c.id !== controle.id);
        this.listaLancamentos = this.listaLancamentos.filter(l => l.idControle !== controle.id);
      }
    },
    formatarDataLancamento(lancamento) {
      if (lancamento.parcela && lancamento.data) {
        // Espera que a data esteja no formato "yyyy-mm-dd" ou similar
        const [ano, mes] = lancamento.data.split('-');
        return `${mes}/${ano.slice(-2)}`;
      }
      return lancamento.data;
    },
    lancamentosOrdenados(idControle) {
      return this.listaLancamentos
        .filter(l => l.idControle === idControle)
        .sort((a, b) => {
          if (a.pago === b.pago) return 0;
          return a.pago ? 1 : -1; // pagos vão para o final
        });
    }
  },
  components: {ModalCadastraLancamento, ModalCadastraControle, ModalGerenciaControles}
}
</script>
<template>
  <section class="content-section">
    <div class="d-flex justify-content-between align-items-center py-2 px-3 bx-shadow">
      <h4>Controles</h4>
      <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" @click="toggleDropdown" ref="dropdownButton">
          <i class="bi bi-three-dots-vertical"></i>
        </button>
        <ul class="dropdown-menu" :class="{ 'show': dropdownAberto }" ref="dropdownMenu">
          <li><a href="#" class="dropdown-item" @click="abrirModalControle"><i class="bi bi-plus-circle me-2"></i>Adicionar Controle</a></li>
          <li><a href="#" class="dropdown-item" @click="abrirModalGerenciaControles"><i class="bi bi-pencil me-2"></i>Editar Controles</a></li>
          <li><a href="#" class="dropdown-item" @click="exportarControles"><i class="bi bi-download me-2"></i>Exportar</a></li>
          <li><a href="#" class="dropdown-item" @click="limparControles"><i class="bi bi-trash me-2"></i>Limpar Todos</a></li>
        </ul>
      </div>
    </div>
    <div class="w-100 d-flex flex-column justify-content-center align-items-center" v-if="listaControles.length === 0">
      <h4 class="text-muted">Nenhum controle adicionado.</h4>
      <h5 class="text-muted">Clique no <i class="bi bi-three-dots-vertical"></i> e adicione.</h5>
    </div>
    <!-- Removido o formulário antigo aqui -->
     <div class="scrollable-content s-c-h1 d-flex flex-column align-items-center">

         <div v-for="(item) in listaControles" :key="item.id" class="controle-card mb-4 p-3 rounded shadow-sm bg-light.bg-gradient w-100">
           <div class="d-flex justify-content-between align-items-center mb-2">
             <div class="d-flex align-items-center gap-2">
               <strong class="controle-nome">{{ item.nome }}</strong>
               <!-- <button class="btn btn-sm btn-light p-1 ms-1" @click="expandirControle(item.id)">
                 <i :class="controlesExpandidos[item.id] ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
               </button> -->
               <div v-if="item.descricao" class="text-muted small mt-1">{{ item.descricao }}</div>
             </div>
             <div class="d-flex align-items-center gap-2">
               <button class="btn btn-primary btn-sm btn-add-lancamento" @click="abrirModalLancamento(item)">
                 <i class="bi bi-plus-lg me-1"></i>Add
               </button>
               <div class="dropdown">
                 <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" @click="toggleDropdownControle(item.id)">
                   <i class="bi bi-gear"></i>
                 </button>
                 <ul class="dropdown-menu" :class="{ 'show': dropdownsAbertos[item.id] }">
                   <li><a href="#" class="dropdown-item" @click="editarControle(item)"><i class="bi bi-pencil me-2"></i>{{ controlesEmEdicao[item.id] ? 'Sair da Edição' : 'Editar Lançamentos' }}</a></li>
                   <li><a href="#" class="dropdown-item" @click="pagarTodosLancamentos(item)"><i class="bi bi-trash me-2"></i>Limpar Lançamentos</a></li>
                 </ul>
               </div>
             </div>
           </div>
           <div class="soma-lancamentos mb-2 ms-1 d-flex align-items-center justify-content-between flex-column align-items-start">
             <div class="d-flex align-items-center justify-content-between w-100">
               <div class="d-flex flex-column">
                 <span class="text-secondary small">
                   Inicial: <strong>{{ formatCurrency(somaLancamentosPorControle[item.id] || 0, true) }}</strong>
                 </span>
                 <span class="text-secondary small mt-1">
                   Restante: <strong>{{ formatCurrency((somaLancamentosPorControle[item.id] || 0) - (somaPagosPorControle[item.id] || 0), true) }}</strong>
                 </span>
               </div>
               <span class="ms-3">Soma: <strong>{{ formatCurrency(somaSelecionadaPorControle[item.id] || 0, true) }}</strong></span>
             </div>
             <div class="w-100 d-flex align-items-center justify-content-between mt-1">
               <span class="badge bg-secondary ms-2">{{ quantidadeLancamentosPorControle[item.id] }} lançamento<span v-if="quantidadeLancamentosPorControle[item.id] !== 1">s</span></span>
               <button class="btn btn-sm btn-light p-1 ms-1" @click="expandirControle(item.id)">
                 <i :class="controlesExpandidos[item.id] ? 'bi bi-chevron-up' : 'bi bi-chevron-down'"></i>
                 </button>
             </div>
           </div>
           <transition-group v-show="controlesExpandidos[item.id]" name="fade-move" tag="ul" class="lista-lancamentos mt-3">
             <li v-for="l in lancamentosOrdenados(item.id)" :key="l.id + '-' + l.pago" class="lancamento-item d-flex align-items-center justify-content-between p-2 mb-2 rounded" :class="{ 'lancamento-pago': l.pago }">
               <div>
                 <div class="d-flex flex-column">
                   <span class="lancamento-valor text-success fw-bold">{{ formatCurrency(l.valor, true) }}</span>
                   <span class="lancamento-data text-muted">{{ formatarDataLancamento(l) }}</span>
                 </div>
                 <span class="lancamento-desc">{{ l.descricao }}</span>
                 <span v-if="l.parcela" class="badge bg-info">Parcela {{ l.parcela }}</span>
               </div>
               <div class="d-flex align-items-center gap-2">
                 <input type="checkbox" class="form-check-input me-1" :checked="l.pago" @change="marcarPago(l)">
                 <span class="small">Pago</span>
                 <input type="checkbox" class="form-check-input me-1" :checked="l.soma" @change="marcarSoma(l)">
                 <span class="small">Soma</span>
                 <div v-if="controlesEmEdicao[item.id]" class="d-flex gap-1">
                   <button class="btn btn-sm btn-outline-primary" @click="abrirModalEditarLancamento(item, l)">
                     <i class="bi bi-pencil"></i>
                   </button>
                   <button class="btn btn-sm btn-outline-danger" @click="excluirLancamento(l)">
                     <i class="bi bi-trash"></i>
                   </button>
                 </div>
               </div>
             </li>
           </transition-group>
          </div>
    </div>
    <ModalCadastraLancamento
      v-if="modalLancamentoAberto"
      :controle="controleSelecionado"
      :tiposControle="listaControles"
      :lancamento="lancamentoEditando"
      @fechar="fecharModalLancamento"
      @salvar="salvarLancamentoNoControle"
    />
    <ModalCadastraControle
      v-if="modalControleAberto"
      @fechar="fecharModalControle"
      @salvar="controle => { addControle(controle); fecharModalControle(); }"
      :controle="controleEditando"
    />
    <ModalGerenciaControles
      v-if="modalGerenciaControlesAberto"
      :controles="listaControles"
      @fechar="fecharModalGerenciaControles"
      @editar="editarControleViaModal"
      @excluir="excluirControleViaModal"
    />
  </section>
</template>

<style scoped>

.fade-move-enter-active, .fade-move-leave-active {
  transition: all 0.9s cubic-bezier(.55,0,.1,1);
}
.fade-move-enter-from, .fade-move-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
.fade-move-leave-active {
  position: absolute;
  
}
.add-controle-box {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem 1rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
.lista-controles {
  list-style: none;
  margin: 0;
}
.controle-card {
  border-left: 4px solid #0d6efd;
  background: #e6e6e6;
}
.controle-nome {
  font-size: 1.15rem;
}
.btn-add-lancamento {
  font-weight: 500;
  border-radius: 6px;
  padding: 0.4rem 0.8rem;
  font-size: 0.875rem;
  box-shadow: 0 2px 4px rgba(13,110,253,0.15);
  transition: all 0.2s;
  border: none;
}
.btn-add-lancamento:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(13,110,253,0.25);
}
.dropdown .btn {
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  border: 1px solid #dee2e6;
  background: #fff;
  color: #6c757d;
  transition: all 0.2s;
}
.dropdown .btn:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
  color: #495057;
}
.dropdown .btn:focus {
  box-shadow: 0 0 0 0.2rem rgba(108, 117, 125, 0.25);
}
.lista-lancamentos {
  list-style: none;
  padding: 0;
  margin: 0;
}
.lancamento-item {
  background: #ffffff;
  border-radius: 8px;
  font-size: 1rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.lancamento-valor {
  font-size: 1.1rem;
}
.lancamento-data {
  font-size: 0.95rem;
}
.lancamento-desc {
  font-size: 0.95rem;
  color: #555;
}
.lancamento-pago {
  background: #d1e7dd !important;
  text-decoration: line-through;
  color: #198754 !important;
  opacity: 0.8;
}
.soma-lancamentos {
  font-size: 1.05rem;
  color: #495057;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Dropdown customizado */
.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1000;
  display: none;
  min-width: 10rem;
  padding: 0.5rem 0;
  margin: 0.125rem 0 0;
  font-size: 1rem;
  color: #212529;
  text-align: left;
  list-style: none;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.375rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.175);
}

.dropdown-menu.show {
  display: block;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 0.25rem 1rem;
  clear: both;
  font-weight: 400;
  color: #212529;
  text-align: inherit;
  text-decoration: none;
  white-space: nowrap;
  background-color: transparent;
  border: 0;
  cursor: pointer;
}

.dropdown-item:hover {
  color: #1e2125;
  background-color: #e9ecef;
}

.dropdown-item:active {
  color: #fff;
  text-decoration: none;
  background-color: #0d6efd;
}
.btn-light {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  color: #495057;
  transition: background 0.2s, color 0.2s;
}
.btn-light:hover {
  background: #e2e6ea;
  color: #212529;
}
</style>

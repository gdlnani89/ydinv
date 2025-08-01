<script>
import Periodo from './Periodo.vue';
import { formatCurrency } from '../utils/formatters.js';

export default {
  components: { Periodo },
  props: ['receitas', 'despesas', 'contas'],
  data() {
    return {
      periodoSelecionado: '',
      contaSelecionada: '',
    }
  },
  computed: {
    saldoInicial() {
      // Se não há período selecionado, saldo inicial é 0
      if (!this.periodoSelecionado) {
        return 0;
      }
      
      // Se há período selecionado, calcula o saldo até o início do período
      const [anoSelecionado, mesSelecionado] = this.periodoSelecionado.split('-');
      const dataInicioPeriodo = `${anoSelecionado}-${mesSelecionado}-01`;
      
      let saldoInicial = 0;
      
      // Soma receitas até o início do período
      if (this.receitas) {
        this.receitas.forEach(receita => {
          if (receita.data < dataInicioPeriodo) {
            saldoInicial += Number(receita.valor || 0);
          }
        });
      }
      
      // Subtrai despesas até o início do período
      if (this.despesas) {
        this.despesas.forEach(despesa => {
          if (despesa.data < dataInicioPeriodo) {
            saldoInicial -= Number(despesa.valor || 0);
          }
        });
      }
      
      return saldoInicial;
    },
    
    extratoCompleto() {
      let extrato = [];
      
      // Adiciona receitas
      this.receitas.forEach(receita => {
        extrato.push({
          ...receita,
          tipo: 'receita',
          valorNumerico: Number(receita.valor),
          dataFormatada: this.formatarData(receita.data)
        });
      });
      
      // Adiciona despesas
      this.despesas.forEach(despesa => {
        extrato.push({
          ...despesa,
          tipo: 'despesa',
          valorNumerico: -Number(despesa.valor), // Negativo para despesas
          dataFormatada: this.formatarData(despesa.data)
        });
      });
      
      // Filtra por período se selecionado
      if (this.periodoSelecionado) {
        extrato = extrato.filter(item => {
          // Garante que pega só o ano-mês
          return item.data && item.data.substring(0, 7) === this.periodoSelecionado;
        });
      }
      
      // Filtra por conta se selecionada
      if (this.contaSelecionada) {
        extrato = extrato.filter(item => item.contaId === this.contaSelecionada);
      }
      console.log(extrato);
      
      // Ordena por data (mais recente primeiro)
      return extrato.sort((a, b) => new Date(b.data) - new Date(a.data));
    },
    
    saldoAtual() {
      return this.extratoCompleto.reduce((saldo, item) => saldo + item.valorNumerico, this.saldoInicial);
    },
    
    saldoAcumulado() {
      // Ordena por data cronologicamente (mais antigo primeiro) para calcular o saldo corretamente
      const extratoOrdenado = [...this.extratoCompleto].sort((a, b) => new Date(a.data) - new Date(b.data));
      
      let saldo = this.saldoInicial;
      const extratoComSaldo = extratoOrdenado.map(item => {
        saldo += item.valorNumerico;
        return { ...item, saldoAcumulado: saldo };
      });
      
      // Retorna ordenado por data (mais recente primeiro) para exibição
      return extratoComSaldo.sort((a, b) => new Date(b.data) - new Date(a.data));
    }
  },
  methods: {
    formatarData(data) {
      const [ano, mes, dia] = data.split('-');
      return `${dia}/${mes}/${ano}`;
    },
    
    atualizarPeriodo(novoPeriodo) {
      this.periodoSelecionado = novoPeriodo;
    },
    
    getNomeConta(contaId) {
      const conta = this.contas.find(c => c.id === contaId);
      return conta ? conta.nome : 'Conta não encontrada';
    },
    
    getCorConta(contaId) {
      const conta = this.contas.find(c => c.id === contaId);
      return conta ? conta.cor : '#6c757d';
    }
  }
}
</script>

<template>
  <section class="controles-section">
    <!-- Cabeçalho -->
    <div class="d-flex justify-content-between align-items-center m-2">
      <h3 class="titulo-section">Extrato</h3>
      <div class="filtros-container">
        <select v-model="contaSelecionada" class="form-select form-select-sm filtro-conta">
          <option value="">Todas as contas</option>
          <option v-for="conta in contas" :key="conta.id" :value="conta.id">
            {{ conta.nome }}
          </option>
        </select>
        </div>
    </div>
    <Periodo v-model="periodoSelecionado" @periodo-selecionado="atualizarPeriodo" />

    <!-- Lista de Lançamentos -->
    <div class="extrato-lista">
      <div v-if="saldoAcumulado.length === 0" class="text-center py-5">
        <i class="bi bi-inbox display-4 text-muted"></i>
        <p class="text-muted mt-3">Nenhum lançamento encontrado para o período selecionado.</p>
      </div>
      
      <div v-else v-for="item in saldoAcumulado" :key="`${item.tipo}-${item.id}`" 
           class="lancamento-item d-flex justify-content-between align-items-center p-3 mb-2 rounded shadow-sm">
        <div class="d-flex align-items-center gap-3">
          <!-- Ícone do tipo -->
          <div class="tipo-icon" :class="item.tipo === 'receita' ? 'bg-success' : 'bg-danger'">
            <i :class="item.tipo === 'receita' ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i>
          </div>
          <!-- Informações do lançamento -->
          <div class="lancamento-info">
            <div class="d-flex align-items-center gap-2 mb-1">
              <strong class="lancamento-descricao">{{ item.descricao }}</strong>
              <span class="badge" :style="{ backgroundColor: getCorConta(item.contaId) }">
                {{ getNomeConta(item.contaId) }}
              </span>
            </div>
            <small class="text-muted tx-color">{{ item.dataFormatada }}</small>
          </div>
        </div>
        <!-- Valor e saldo -->
        <div class="text-end lancamento-valores">
          <div class="valor-lancamento" :class="item.tipo === 'receita' ? 'text-success' : 'text-danger'">
            <strong>{{ item.tipo === 'receita' ? '+' : '-' }}{{ formatCurrency(Math.abs(item.valorNumerico), true) }}</strong>
          </div>
          <small class="text-muted tx-color">Saldo: {{ formatCurrency(item.saldoAcumulado, true) }}</small>
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped>
  .tipo-icon{
      border-radius: 50%;
      padding: 10px;
      color: white;
  }
  .lancamento-item {
      background-color: var(--card-bg) !important;
      color: var(--text-primary) !important;
  }
  .filtro-conta{
    background-color: var(--card-bg) !important;
  }
  .tx-color{
    color: var(--text-primary) !important;
  }
</style>
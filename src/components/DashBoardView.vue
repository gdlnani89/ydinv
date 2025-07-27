<template>
  <section class="content-section" id="dashboard" >
    <div class="m-2 d-flex justify-content-between align-items-start">
        <div>
            <h2 class="heading-2">Olá, {{ nome }} 👋</h2>
            <p class="body-medium">Aqui está o resumo da sua vida financeira.</p>
        </div>
        <div class="d-flex align-items-center gap-2">
            <ThemeToggle />
            <DropdownAdd 
                @abrir-cadastro-conta="abrirModalConta" 
                @gerenciar-contas="gerenciarContas"
                @abrir-modal-cartao="abrirModalCartao"
                @gerenciar-cartoes="gerenciarCartoes"
            />
        </div>
    </div>
    <div class="row">
        <div class="col-lg-7">
            <div class="card balance-card">
                <div class="balance-header">
                    <span class="ms-2">Saldo Total em Contas</span>
                    <i
                        class="me-2 text-white"
                        :class="['bi', isBalanceHidden ? 'bi-eye-fill' : 'bi-eye-slash-fill']" 
                        @click="toggleBalancePrivacy"
                        style="cursor: pointer;"
                        :title="isBalanceHidden ? 'Mostrar saldos' : 'Ocultar saldos'"
                    ></i>
                </div>
                <h2 class="text-center" id="totalBalance">{{ formatBalanceWithPrivacy(saldoTotal) }}</h2>
                <div class="d-flex justify-content-around">
                    <div class="summary-item">
                        <span class="label-incomes"><i class="bi bi-arrow-up"></i> Receitas</span>
                        <span class="value-incomes">{{ formatBalanceWithPrivacy(totalReceitas) }}</span>
                    </div>
                    <div class="summary-item">
                        <span class="label-expenses"><i class="bi bi-arrow-down"></i> Despesas</span>
                        <span class="value-expenses">{{ formatBalanceWithPrivacy(totalDespesas) }}</span>
                    </div>
                    <!-- <div class="summary-item" v-if="totalDespesasFuturas !== '0,00'">
                        <span class="label-futuras"><i class="bi bi-calendar-event"></i> Futuras</span>
                        <span class="value-futuras">R$ {{ totalDespesasFuturas }}</span>
                    </div> -->
                </div>
            </div>
        </div>
        <div class="col-lg-5">
            <div class="card quick-actions-card">
                <h4 class="ms-4">Ações</h4>
                <div class="actions-grid">
                    <a href="#" class="action-item" @click.prevent="$emit('navigate', 'receitas')">
                        <div class="icon-wrapper bg-success-light"><i class="bi bi-cash-coin text-success"></i></div>
                        <span>Receitas</span>
                    </a>    
                    <a href="#" class="action-item" @click.prevent="$emit('navigate', 'despesas')">
                        <div class="icon-wrapper bg-danger-light"><i class="bi bi-wallet2 text-danger"></i></div>
                        <span>Débitos</span>
                    </a>
                    <a href="#" class="action-item" @click.prevent="$emit('navigate', 'faturas')">
                        <div class="icon-wrapper bg-primary-light"><i class="bi bi-credit-card-2-front text-primary"></i></div>
                        <span>Faturas</span>
                    </a>
                </div>
            </div>
            <div class="card card-totais-tipo mt-3">
                <h5 class="mb-2 ms-2" style="font-size:1.08rem; color:#2563eb;">Despesas do mês por categoria</h5>
                <ul class="totais-tipo-list">
                    <li v-for="(valor, tipo) in totaisPorTipoMesAtual" :key="tipo" class="d-flex justify-content-between align-items-center py-1 px-2">
                        <span class="tipo-label">{{ tipo }}</span>
                        <span class="tipo-total">{{ formatCurrency(valor) }}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <ModalCadastraNome v-show="modalCadastro" :modal="modalCadastro" @fechar-modal="fecharModal"/>
    <ModalCadastraConta 
      v-show="modalConta" 
      :modal="modalConta" 
      @fechar-modal="fecharModalConta"
      @adicionar-conta="handleAdicionarConta"
    />
    <transition name="toast-fade">
        <div v-if="showContaAdicionada" class="toast-conta-adicionada">
            <i class="bi bi-check-circle-fill"></i> Conta adicionada com sucesso!
        </div>
    </transition>
    <transition name="toast-fade">
        <div v-if="showContaErro" class="toast-conta-erro">
            <i class="bi bi-x-circle-fill"></i> Já existe uma conta com esse nome!
        </div>
    </transition>
</section>
</template>

<script>
import ModalCadastraNome from './ModalCadastraNome.vue'
import ModalCadastraConta from './ModalCadastraConta.vue'
import DropdownAdd from './DropdownAdd.vue'
import ThemeToggle from './ThemeToggle.vue'
import { useBalancePrivacy } from '../composables/useBalancePrivacy.js'
import currencyMixin from '../mixins/currencyMixin.js'

export default {
    mixins: [currencyMixin],
    props: ['receitas', 'despesas','contas'],
    setup() {
        const { isBalanceHidden, toggleBalancePrivacy, formatBalanceWithPrivacy } = useBalancePrivacy();
        return {
            isBalanceHidden,
            toggleBalancePrivacy,
            formatBalanceWithPrivacy
        };
    },
    computed: {
        totalReceitas() {
            return this.receitas ? this.receitas.reduce((total, receita) => {
                return total + Number(receita.valor || 0);
            }, 0) : 0;
        },
        totalDespesas() {
            return this.despesas ? this.despesas.reduce((total, despesa) => {
                return total + Number(despesa.valor || 0);
            }, 0) : 0;
        },
        saldoTotal() {
            return this.totalReceitas - this.totalDespesas;
        },
        totaisPorTipoMesAtual() {
            // Agrupa despesas do mês atual por tipo
            if (!this.despesas || !Array.isArray(this.despesas)) return {};
            const now = new Date();
            const mesAtual = String(now.getMonth() + 1).padStart(2, '0');
            const anoAtual = String(now.getFullYear());
            const totais = {};
            this.despesas.forEach(despesa => {
                if (!despesa.data || !despesa.tipo) return;
                const [ano, mes] = despesa.data.split('-');
                if (ano === anoAtual && mes === mesAtual) {
                    if (!totais[despesa.tipo]) totais[despesa.tipo] = 0;
                    totais[despesa.tipo] += Number(despesa.valor || 0);
                }
            });
            return totais;
        },
    },
    data(){
        return{
            nome : '',
            cadastraNome : false,
            modalCadastro : false,
            modalConta: false,
            showContaAdicionada: false,
            showContaErro: false,
        }
    },
    methods:{
        carregaNome(){
                const nomeCliente = localStorage.getItem('titular') || ''

                if(nomeCliente){
                    this.nome = nomeCliente
                }else{
                    this.modalCadastro = true
                }

        },
        fecharModal(){
            this.modalCadastro = false
            this.carregaNome() // Recarrega o nome após salvar
        },
        fecharModalConta() {
            this.modalConta = false;
            //this.carregarContas(); // Recarrega as contas após cadastrar
        },
        abrirModalConta() {
            this.modalConta = true;
        },
        handleAdicionarConta(novaConta){
            // Validação simples para evitar contas duplicadas
            const nomeNovo = (novaConta.nome || '').trim();
            const existe = (this.contas || []).some(conta => conta.nome.trim().toLowerCase() === nomeNovo.toLowerCase());
            if (existe) {
                this.exibirToastContaErro()
                return;
            }
            this.$emit('adicionar-conta', novaConta)
            this.modalConta = false
            this.exibirToastContaAdicionada();
        },
        gerenciarContas(){
            this.$emit('gerenciar-contas')
        },
        abrirModalCartao(){
            this.$emit('abrir-modal-cartao')
        },
        gerenciarCartoes(){
            this.$emit('gerenciar-cartoes')
        },
        exibirToastContaAdicionada() {
            this.showContaAdicionada = true;
            setTimeout(() => {
                this.showContaAdicionada = false;
            }, 3000); // Exibe o toast por 3 segundos
        },
        exibirToastContaErro() {
            this.showContaErro = true;
            setTimeout(() => {
                this.showContaErro = false;
            }, 3000); // Exibe o toast por 3 segundos
        }
    },
    mounted(){
        this.carregaNome()
        // Escuta o evento para abrir o modal de cadastro
        window.addEventListener('abrir-modal-cadastro-conta', this.abrirModalConta)
    },
    beforeUnmount(){
        // Remove o listener quando o componente for destruído
        window.removeEventListener('abrir-modal-cadastro-conta', this.abrirModalConta)
    },
    components: { 
        ModalCadastraNome,
        ModalCadastraConta,
        DropdownAdd,
        ThemeToggle
    }
}
</script>

<style>

/* Layout responsivo e moderno para o dashboard */
.content-section {
  max-width: 100vw;
  overflow-x: hidden;
}
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
  margin: 0 auto;
  justify-content: center;
  align-items: flex-start;
}
.col-lg-4, .col-lg-5, .col-lg-7, .col-lg-8 {
  width: 100%;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  box-sizing: border-box;
}
@media (min-width: 992px) {
  .col-lg-7 { width: 60%; }
  .col-lg-5 { width: 40%; }
  .row {
    justify-content: center;
    align-items: flex-start;
  }
}
.card {
  border: none;
  margin-bottom: 1.1rem;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  background: var(--card-background, #fff);
  padding: 1.3rem 0.7rem 1.1rem 0.7rem;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
}
.balance-card {
  background: linear-gradient(135deg, var(--primary-color, #2563eb), #1a3a60 90%);
  color: #fff;
  margin: 0 0 1rem 0;
  position: relative;
  overflow: hidden;
}
.balance-header {
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
}
.balance-header i {
  cursor: pointer;
  font-size: 1.3rem;
  opacity: 0.8;
  transition: opacity 0.2s;
}
.balance-header i:hover {
  opacity: 1;
}
.balance-amount {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0.5rem 0 0.2rem 0;
  letter-spacing: 1px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.10);
}
.balance-summary {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
  border-top: 1px solid rgba(255,255,255,0.18);
  padding-top: 1rem;
  flex-wrap: wrap;
}
.summary-item {
  font-size: 1rem;
  min-width: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.summary-item .label-incomes, .summary-item .label-expenses {
  font-size: 0.95rem;
  opacity: 0.85;
  display: block;
}
.summary-item .value-incomes { color: #4ade80; font-weight: 700; font-size: 1.1rem; }
.summary-item .value-expenses { color: #f87171; font-weight: 700; font-size: 1.1rem; }
.summary-item .label-futuras { color: var(--text-secondary); font-size: 0.9rem; }
.summary-item .value-futuras { color: #f59e0b; font-weight: 600; }

.quick-actions-card {
  padding: 1.2rem 1rem 1rem 1rem;
  background: var(--card-background, #fff);
  border-radius: 18px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
}
.quick-actions-card h4 {
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
  color: var(--primary-color, #2563eb);
}
.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 1.2rem;
}
.action-item {
  text-align: center;
  text-decoration: none;
  color: var(--text-color, #222);
  background: #f8fafc;
  border-radius: 12px;
  padding: 1rem 0.5rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
.action-item:hover {
  background: #e0e7ef;
  box-shadow: 0 4px 12px rgba(37,99,235,0.08);
  transform: translateY(-2px) scale(1.03);
}
.action-item .icon-wrapper {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  margin: 0 auto 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e0e7ef;
  font-size: 1.5rem;
}
.action-item .icon-wrapper i { font-size: 1.5rem; }
.action-item span { font-size: 1rem; font-weight: 600; }
.bg-success-light { background-color: #e6f9f0 !important; }
.text-success { color: #22c55e !important; }
.bg-danger-light { background-color: #fbeaea !important; }
.text-danger { color: #ef4444 !important; }
.bg-primary-light { background-color: #e0e7ef !important; }
.text-primary { color: #2563eb !important; }

/* Ajuste para mobile: padding extra na seção e cards */
@media (max-width: 600px) {
  .content-section {
    padding-bottom: 80px !important;
    padding-top: 0.5rem;
    max-width: 100vw;
    overflow-x: hidden;
  }
  .row {
    gap: 0.5rem;
    margin: 0;
    padding: 0 0.5rem;
  }
  .card, .balance-card, .quick-actions-card {
    padding: 0.7rem 0.2rem 0.7rem 0.2rem;
    margin-bottom: 0.7rem;
  }
  .balance-amount {
    font-size: 1.5rem;
  }
  .actions-grid {
    gap: 0.4rem;
  }
}
/* Toast visual para feedback de conta adicionada */
.toast-conta-adicionada {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: #2563eb;
  color: #fff;
  padding: 0.85rem 1.6rem;
  border-radius: 2rem;
  box-shadow: 0 2px 16px rgba(37,99,235,0.13);
  font-size: 1.08rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  z-index: 9999;
  opacity: 0.97;
}
.toast-conta-adicionada i {
  font-size: 1.3rem;
  color: #4ade80;
}
.toast-fade-enter-active, .toast-fade-leave-active {
  transition: opacity 0.4s;
}
.toast-fade-enter-from, .toast-fade-leave-to {
  opacity: 0;
}/* Toast visual para feedback de conta adicionada */
.toast-conta-adicionada {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: #2563eb;
  color: #fff;
  padding: 0.85rem 1.6rem;
  border-radius: 2rem;
  box-shadow: 0 2px 16px rgba(37,99,235,0.13);
  font-size: 1.08rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  z-index: 9999;
  opacity: 0.97;
}
.toast-conta-adicionada i {
  font-size: 1.3rem;
  color: #4ade80;
}
.toast-fade-enter-active, .toast-fade-leave-active {
  transition: opacity 0.4s;
}
.toast-fade-enter-from, .toast-fade-leave-to {
  opacity: 0;
}
/* Toast de erro para conta duplicada */
.toast-conta-erro {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: #ef4444;
  color: #fff;
  padding: 0.85rem 1.6rem;
  border-radius: 2rem;
  box-shadow: 0 2px 16px rgba(239,68,68,0.13);
  font-size: 1.08rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  z-index: 9999;
  opacity: 0.97;
}
.toast-conta-erro i {
  font-size: 1.3rem;
  color: #fff;
}
.card-totais-tipo {
  margin-top: 1.1rem;
  background: #f8fafc;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(37,99,235,0.06);
  padding: 1rem 0.7rem 0.7rem 0.7rem;
}
.totais-tipo-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.tipo-label {
  font-size: 1rem;
  color: #444;
  font-weight: 500;
}
.tipo-total {
  font-size: 1rem;
  color: #2563eb;
  font-weight: 700;
}
</style>

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
                    <span>Saldo Total em Contas</span>
                    <i 
                        :class="['bi', isBalanceHidden ? 'bi-eye-fill' : 'bi-eye-slash-fill']" 
                        @click="toggleBalancePrivacy"
                        style="cursor: pointer;"
                        :title="isBalanceHidden ? 'Mostrar saldos' : 'Ocultar saldos'"
                    ></i>
                </div>
                <h3 class="balance-amount" id="totalBalance">{{ formatBalanceWithPrivacy(saldoTotal) }}</h3>
                <div class="balance-summary">
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
                <h4 class="heading-4">Ações</h4>
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
        </div>
    </div>
    <!-- <div class="row">
        <div class="col-lg-8">
            <div class="card">
                <div>
                    <h4>Últimas Transações</h4>
                </div>
                <ul class="list-mobile">
                    <li v-for="transacao in ultimasTransacoes" :key="transacao.id" class="d-flex">
                        <i :class="['bi', transacao.tipo === 'receita' ? 'bi-arrow-up-circle-fill text-success' : 'bi-arrow-down-circle-fill text-danger']"></i>
                        <div class="transaction-info d-flex flex-column ms-2">
                            <span class="transaction-description">{{ transacao.descricao }}</span>
                            <span class="transaction-amount" :class="transacao.tipo === 'receita' ? 'text-success' : 'text-danger'">
                                {{ transacao.tipo === 'receita' ? '+' : '-' }} {{ formatCurrency(transacao.valor) }}
                            </span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="col-lg-4">
            <div class="card">
                <div>
                    <h4>Despesas por Categoria</h4>
                </div>
                <div class="chart-container">
                    <canvas ref="categoryPieChart"></canvas>
                </div>
            </div>
        </div>
    </div> -->
    <ModalCadastraNome v-show="modalCadastro" :modal="modalCadastro" @fechar-modal="fecharModal"/>
    <ModalCadastraConta 
      v-show="modalConta" 
      :modal="modalConta" 
      @fechar-modal="fecharModalConta"
      @adicionar-conta="handleAdicionarConta"
    />
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
    props: ['receitas', 'despesas'],
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
        }
    },
    data(){
        return{
            nome : '',
            cadastraNome : false,
            modalCadastro : false,
            modalConta: false,
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
            this.$emit('adicionar-conta', novaConta)
            this.modalConta = false
        },
        gerenciarContas(){
            this.$emit('gerenciar-contas')
        },
        abrirModalCartao(){
            this.$emit('abrir-modal-cartao')
        },
        gerenciarCartoes(){
            this.$emit('gerenciar-cartoes')
        }

    },
    mounted(){
        this.carregaNome()
        // Escuta o evento para abrir o modal de cadastro
        window.addEventListener('abrir-modal-cadastro-conta', this.abrirModalConta)
        console.log('DashBoardView mounted, ThemeToggle component:', this.$options.components.ThemeToggle)
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
.row {
    display: flex;
    flex-wrap: wrap;
}
.col-lg-4, .col-lg-5, .col-lg-7, .col-lg-8 {
    width: 100%;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
}
.card{
    border: none;
    margin-bottom: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
    background-color: var(--card-background);
    padding: 1.5rem;
}
.quick-actions-card {
    padding: 1rem;
}
.quick-actions-card h4 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 1rem;
}
.actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 1rem;
}
.action-item {
    text-align: center;
    text-decoration: none;
    color: var(--text-color);
}
.action-item .icon-wrapper {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin: 0 auto 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;
}
.action-item .icon-wrapper i { font-size: 1.2rem; }
.action-item span { font-size: 0.9rem; font-weight: 500; }
.bg-success-light { background-color: var(--success-light); }
.text-success { color: var(--success-color) !important; }
.bg-danger-light { background-color: var(--danger-light); }
.text-danger { color: var(--danger-color) !important; }
.bg-primary-light { background-color: var(--primary-light); }
.text-primary { color: var(--accent-color) !important; }
.balance-card {
    padding: 1.5rem;
    background: linear-gradient(135deg, var(--primary-color), #1a3a60);
    color: white;
    margin: 0 10px;
    margin-bottom: 10px;
}
.balance-header {
    display: flex;
    justify-content: space-between;
    font-size: 1rem;
    opacity: 0.8;
}
.balance-header i {
    cursor: pointer;
}
.balance-amount {
    font-size: 2.8rem;
    font-weight: 700;
    margin: 0.5rem 0;
}
.balance-summary {
    display: flex;
    gap: 2rem;
    margin-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    padding-top: 1rem;
}

.summary-item {
    font-size: 0.9rem;
}
.summary-item .label-incomes, .summary-item .label-expenses {
    font-size: 0.9rem;
    opacity: 0.8;
    display: block;
}
.summary-item .value-incomes { color: #4ade80; font-weight: 600; }
.summary-item .value-expenses { color: #f87171; font-weight: 600; }
.summary-item .label-futuras { color: var(--text-secondary); font-size: 0.9rem; }
.summary-item .value-futuras { color: #f59e0b; font-weight: 600; }
</style>
<template>
    <div class="fundo-modal">
        <div class="card-modal">
            <h5 class="card-title">{{ modoEdicao ? 'Editar Investimento' : 'Cadastrar Investimento' }}</h5>
            <div class="overflow-auto" style="max-height: 60vh;">
                <div class="mb-3">
                    <label class="form-label">Nome do Investimento</label>
                    <input
                        v-model="nome"
                        type="text"
                        class="form-control"
                        placeholder="Ex: CDB Banco X, Ações Petrobras..."
                    >
                </div>
    
                <div class="mb-3">
                    <label class="form-label">Tipo de Investimento</label>
                    <select 
                        class="form-control"
                        v-model="tipo"
                        >
                        <option value="">Selecione o tipo</option>
                        <option value="CDB">CDB</option>
                        <option value="LCI/LCA">LCI/LCA</option>
                        <option value="Tesouro Direto">Tesouro Direto</option>
                        <option value="Ações">Ações</option>
                        <option value="Fundos">Fundos</option>
                        <option value="Poupança">Poupança</option>
                        <option value="Previdência">Previdência</option>
                        <option value="Criptomoedas">Criptomoedas</option>
                        <option value="Outros">Outros</option>
                    </select>
                </div>

                <div v-if="tipo === 'Ações'" class="mb-3">
                    <label class="form-label">Quantidade</label>
                    <input 
                        type="number"
                        class="form-control"
                        v-model="quantidade"
                        placeholder="Ex: 1000"
                        min="1"
                        >
                </div>
    
                <div class="mb-3">
                    <label class="form-label">Banco/Instituição</label>
                    <select 
                        class="form-control"
                        v-model="banco"
                        @change="onBancoChange"
                        :disabled="!contas || contas.length === 0"
                    >
                        <option value="">Selecione uma conta</option>
                        <option v-for="conta in contas" :key="conta.id" :value="conta.nome">{{ conta.nome }}</option>
                    </select>
                    <div v-if="!contas || contas.length === 0" class="text-danger mt-1" style="font-size:0.95rem;">Nenhuma conta disponível. Cadastre uma conta no dashboard.</div>
                </div>
    
                
                <div class="d-flex align-items-center justify-content-between">
                    <div class="mb-3">
                        <label class="form-label">Valor <br>Inicial</label>
                        <input 
                            type="text"
                            class="form-control input-modal"
                            v-model="valorInicial"
                            placeholder="0,00"
                            @input="formatarComoMoedaInicial"
                            >
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Valor <br>Atual</label>
                        <input 
                            type="text"
                            class="form-control input-modal"
                            v-model="valorAtual"
                            placeholder="0,00"
                            @input="formatarComoMoedaAtual"
                            >
                    </div>
                </div>
    
                <div class="d-flex align-items-center justify-content-between mb-3">
                    <div class="">
                        <label class="form-label">Data de <br>Aplicação</label>
                        <input 
                            type="date"
                            class="form-control input-modal"
                            v-model="dataAplicacao"
                            >
                    </div>
                    <div class="">
                        <label class="form-label">Data de <br>Vencimento</label>
                        <input 
                            type="date"
                            class="form-control input-modal"
                            v-model="dataVencimento"
                            >
                    </div>
                </div>
    
                <div class="mb-3">
                    <label class="form-label">Observações (opcional)</label>
                    <textarea
                        v-model="observacoes"
                        class="form-control"
                        rows="3"
                        placeholder="Informações adicionais sobre o investimento..."
                    ></textarea>
                </div>
    
            </div>
            <div class="d-flex justify-content-between w-100 border-top pt-3">
                <button class="btn btn-primary" @click="salvarInvestimento">
                    {{ modoEdicao ? 'Atualizar' : 'Adicionar' }}
                </button>
                <button @click="fecharModal" class="btn btn-secondary">Fechar</button>
            </div>
        </div>
    </div>
</template>

<script>
import currencyMixin from '../mixins/currencyMixin.js';

export default {
    mixins: [currencyMixin],
    props: ['investimento'],
    data(){
        return{
            nome: '',
            tipo: '',
            quantidade: null,
            valorInicial: '',
            valorAtual: '',
            dataAplicacao: '',
            dataVencimento: '',
            observacoes: '',
            modoEdicao: false,
            investimentoEditando: null,
            banco: '',
            contas: JSON.parse(localStorage.getItem('contas')) || []
        }
    },
    watch: {
        contas: {
            handler(novasContas) {
                console.log('[ModalCadastraInvestimento] contas mudou:', novasContas);
            },
            immediate: true,
            deep: true
        }
    },
    watch: {
        investimento: {
            handler(novoInvestimento) {
                if (novoInvestimento) {
                    this.carregarInvestimentoParaEdicao(novoInvestimento);
                } else {
                    this.resetarFormulario();
                }
            },
            immediate: true
        },
    },
    methods: {
        fecharModal(){
            this.$emit('fechar-modal-investimento')
        },
        salvarInvestimento(){
            if(!this.nome.trim()){
                alert('Por favor, digite um nome para o investimento')
                return
            }
            if(!this.valorInicial || this.valorInicial === '0,00'){
                alert('Por favor, digite um valor inicial válido')
                return
            }
            
            const valorInicial = parseFloat(this.valorInicial.replace(/\D/g, '')) / 100 || 0;
            
            if(valorInicial <= 0){
                alert('Por favor, digite um valor inicial válido')
                return
            }
            
            const valorAtual = parseFloat(this.valorAtual.replace(/\D/g, '')) / 100 || 0;
            // if(!this.valorAtual || this.valorAtual === '0,00' || valorAtual <= 0){
            //     alert('Por favor, digite um valor atual válido')
            //     return
            // }

            if(!this.tipo){
                alert('Por favor, selecione o tipo de investimento')
                return
            }

            if(!this.dataAplicacao){
                alert('Por favor, selecione a data de aplicação')
                return
            }

            if(!this.banco){
                alert('Por favor, selecione o banco ou instituição')
                return
            }

            const investimento = {
                id: this.modoEdicao ? this.investimentoEditando.id : Date.now(),
                nome: this.nome.trim(),
                tipo: this.tipo,
                quantidade: this.quantidade || 1,
                valorInicial: valorInicial.toString(),
                valorAtual: valorAtual.toString(),
                dataAplicacao: this.dataAplicacao,
                dataVencimento: this.dataVencimento || null,
                observacoes: this.observacoes.trim() || null,
                banco: this.banco
            }
            
            if (this.modoEdicao) {
                this.$emit('atualizar-investimento', investimento);
            } else {
                this.$emit('adicionar-investimento', investimento);
            }
            
            this.resetarFormulario();
            this.fecharModal();
        },
        

        
        carregarInvestimentoParaEdicao(investimento) {
            console.log('Carregando investimento para edição:', investimento);
            this.modoEdicao = true;
            this.investimentoEditando = investimento;
            this.nome = investimento.nome;
            this.tipo = investimento.tipo;
            this.valorInicial = parseFloat(investimento.valorInicial).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
            this.valorAtual = parseFloat(investimento.valorAtual).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
            this.dataAplicacao = investimento.dataAplicacao;
            this.dataVencimento = investimento.dataVencimento || '';
            this.observacoes = investimento.observacoes || '';
            
            // Verificar se o banco está na lista de opções
            const bancosLista = ['Nubank', 'Itaú', 'Bradesco', 'Santander', 'Caixa Econômica Federal', 'Banco do Brasil', 'Banco Inter', 'C6 Bank', 'PagSeguro', 'Mercado Pago', 'XP Investimentos', 'Rico', 'Clear', 'BTG Pactual', 'Warren', 'Easynvest', 'Nu Invest'];
            if (investimento.banco && bancosLista.includes(investimento.banco)) {
                this.banco = investimento.banco;
                this.bancoOutros = '';
            } else if (investimento.banco) {
                this.banco = 'Outros';
                this.bancoOutros = investimento.banco;
            } else {
                this.banco = '';
                this.bancoOutros = '';
            }
            
            console.log('Formulário preenchido:', {
                nome: this.nome,
                tipo: this.tipo,
                valorInicial: this.valorInicial,
                valorAtual: this.valorAtual,
                dataAplicacao: this.dataAplicacao,
                dataVencimento: this.dataVencimento,
                observacoes: this.observacoes,
                banco: this.banco,
                bancoOutros: this.bancoOutros
            });
        },
        
        resetarFormulario() {
            this.nome = '';
            this.tipo = '';
            this.valorInicial = '';
            this.valorAtual = '';
            this.dataAplicacao = '';
            this.dataVencimento = '';
            this.observacoes = '';
            this.modoEdicao = false;
            this.investimentoEditando = null;
            this.banco = '';
            this.bancoOutros = '';
        },

        onBancoChange() {
            if (this.banco !== 'Outros') {
                this.bancoOutros = '';
            }
        },
        
        formatarComoMoedaInicial(e) {
            if (!e || !e.target) return;
            
            // Remove tudo que não é número
            let valorApenasDigitos = e.target.value.replace(/\D/g, '');

            if (!valorApenasDigitos) {
                this.valorInicial = '0,00';
                return;
            }

            const valorNumerico = Number(valorApenasDigitos) / 100;

            this.valorInicial = valorNumerico.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
        },
        formatarComoMoedaAtual(e) {
            if (!e || !e.target) return;
            
            // Remove tudo que não é número
            let valorApenasDigitos = e.target.value.replace(/\D/g, '');

            if (!valorApenasDigitos) {
                this.valorAtual = '0,00';
                return;
            }

            const valorNumerico = Number(valorApenasDigitos) / 100;

            this.valorAtual = valorNumerico.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
        }
    },
}
</script>

<style scoped>
.input-modal {
    max-width: 140px;
}

.form-label {
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
}

.btn {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-primary {
    background-color: var(--btn-primary-bg);
    color: var(--btn-primary-text);
}

.btn-primary:hover {
    background-color: var(--primary-color);
    transform: translateY(-1px);
}

.btn-secondary {
    background-color: var(--btn-secondary-bg);
    color: var(--btn-secondary-text);
}

.btn-secondary:hover {
    background-color: var(--secondary-color);
    transform: translateY(-1px);
}

textarea.form-control {
    resize: vertical;
    min-height: 80px;
}
</style> 
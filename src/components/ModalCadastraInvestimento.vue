<template>
    <div class="fundo-modal">
        <div class="card">
            <h5 class="card-title">{{ modoEdicao ? 'Editar Investimento' : 'Cadastrar Investimento' }}</h5>

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

            <div class="mb-3">
                <label class="form-label">Banco/Instituição</label>
                <select 
                    class="form-control"
                    v-model="banco"
                    @change="onBancoChange"
                    >
                    <option value="">Selecione o banco</option>
                    <option value="Nubank">Nubank</option>
                    <option value="Itaú">Itaú</option>
                    <option value="Bradesco">Bradesco</option>
                    <option value="Santander">Santander</option>
                    <option value="Caixa Econômica Federal">Caixa Econômica Federal</option>
                    <option value="Banco do Brasil">Banco do Brasil</option>
                    <option value="Banco Inter">Banco Inter</option>
                    <option value="C6 Bank">C6 Bank</option>
                    <option value="PagSeguro">PagSeguro</option>
                    <option value="Mercado Pago">Mercado Pago</option>
                    <option value="XP Investimentos">XP Investimentos</option>
                    <option value="Rico">Rico</option>
                    <option value="Clear">Clear</option>
                    <option value="BTG Pactual">BTG Pactual</option>
                    <option value="Warren">Warren</option>
                    <option value="Easynvest">Easynvest</option>
                    <option value="Nu Invest">Nu Invest</option>
                    <option value="Outros">Outros</option>
                </select>
            </div>

            <div class="mb-3" v-if="banco === 'Outros'">
                <label class="form-label">Nome do Banco/Instituição</label>
                <input
                    v-model="bancoOutros"
                    type="text"
                    class="form-control"
                    placeholder="Digite o nome do banco ou instituição..."
                >
            </div>

            <div class="row">
                <div class="col-6">
                    <div class="mb-3">
                        <label class="form-label">Valor Inicial</label>
                        <input 
                            type="text"
                            class="form-control"
                            v-model="valorInicial"
                            placeholder="0,00"
                            @input="formatarComoMoedaInicial"
                            >
                    </div>
                </div>
                <div class="col-6">
                    <div class="mb-3">
                        <label class="form-label">Valor Atual</label>
                        <input 
                            type="text"
                            class="form-control"
                            v-model="valorAtual"
                            placeholder="0,00"
                            @input="formatarComoMoedaAtual"
                            >
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-6">
                    <div class="mb-3">
                        <label class="form-label">Data de Aplicação</label>
                        <input 
                            type="date"
                            class="form-control"
                            v-model="dataAplicacao"
                            >
                    </div>
                </div>
                <div class="col-6">
                    <div class="mb-3">
                        <label class="form-label">Data de Vencimento</label>
                        <input 
                            type="date"
                            class="form-control"
                            v-model="dataVencimento"
                            >
                    </div>
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

            <div class="d-flex justify-content-between w-100">
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
            valorInicial: '',
            valorAtual: '',
            dataAplicacao: '',
            dataVencimento: '',
            observacoes: '',
            modoEdicao: false,
            investimentoEditando: null,
            banco: '',
            bancoOutros: ''
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
        }
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
            if(!this.valorAtual || this.valorAtual === '0,00' || valorAtual <= 0){
                alert('Por favor, digite um valor atual válido')
                return
            }

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

            if(this.banco === 'Outros' && !this.bancoOutros.trim()){
                alert('Por favor, digite o nome do banco ou instituição')
                return
            }

            const bancoFinal = this.banco === 'Outros' ? this.bancoOutros.trim() : this.banco;

            const investimento = {
                id: this.modoEdicao ? this.investimentoEditando.id : Date.now(),
                nome: this.nome.trim(),
                tipo: this.tipo,
                valorInicial: valorInicial.toString(),
                valorAtual: valorAtual.toString(),
                dataAplicacao: this.dataAplicacao,
                dataVencimento: this.dataVencimento || null,
                observacoes: this.observacoes.trim() || null,
                banco: bancoFinal
            }
            
            console.log('Salvando investimento:', {
                modoEdicao: this.modoEdicao,
                investimento: investimento
            });
            
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
    }
}
</script>

<style scoped>
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

.card {
    background: var(--modal-content-bg);
    border-radius: 12px;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.card-title {
    margin-bottom: 1.5rem;
    color: var(--text-primary);
    font-weight: 600;
}

.form-label {
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
}

.form-control {
    border: 1px solid var(--input-border);
    border-radius: 8px;
    padding: 0.75rem;
    font-size: 1rem;
    background-color: var(--input-bg);
    color: var(--text-primary);
    transition: border-color 0.2s ease;
}

.form-control:focus {
    outline: none;
    border-color: var(--input-focus-border);
    box-shadow: var(--input-focus-shadow);
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
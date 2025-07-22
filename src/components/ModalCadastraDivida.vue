<template>
    <div class="fundo-modal">
        <div class="card">
            <h5 class="card-title">{{ modoEdicao ? 'Editar Dívida' : 'Cadastrar Dívida' }}</h5>

            <div class="mb-3">
                <label class="form-label">Nome/Descrição da Dívida</label>
                <input
                    v-model="nome"
                    type="text"
                    class="form-control"
                    placeholder="Ex: Cartão Nubank, Empréstimo pessoal..."
                >
            </div>

            <div class="mb-3">
                <label class="form-label">Tipo de Dívida</label>
                <select 
                    class="form-control"
                    v-model="tipo"
                    >
                    <option value="">Selecione o tipo</option>
                    <option value="Cartão de Crédito">Cartão de Crédito</option>
                    <option value="Empréstimo Pessoal">Empréstimo Pessoal</option>
                    <option value="Financiamento">Financiamento</option>
                    <option value="Cheque Especial">Cheque Especial</option>
                    <option value="Conta em Atraso">Conta em Atraso</option>
                    <option value="Imposto">Imposto</option>
                    <option value="Multa">Multa</option>
                    <option value="Outros">Outros</option>
                </select>
            </div>

            <div class="mb-3">
                <label class="form-label">Credor (Banco/Pessoa/Empresa)</label>
                <input
                    v-model="credor"
                    type="text"
                    class="form-control"
                    placeholder="Ex: Nubank, João Silva, Empresa XYZ..."
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

            <div class="mb-3">
                <label class="form-label">Data de Vencimento</label>
                <input 
                    type="date"
                    class="form-control"
                    v-model="dataVencimento"
                    >
            </div>

            <div class="mb-3">
                <label class="form-label">Observações (opcional)</label>
                <textarea
                    v-model="observacoes"
                    class="form-control"
                    rows="3"
                    placeholder="Informações adicionais sobre a dívida..."
                ></textarea>
            </div>

            <div class="d-flex justify-content-between w-100">
                <button class="btn btn-primary" @click="salvarDivida">
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
    props: ['divida'],
    data(){
        return{
            nome: '',
            tipo: '',
            credor: '',
            valorInicial: '',
            valorAtual: '',
            dataVencimento: '',
            observacoes: '',
            modoEdicao: false,
            dividaEditando: null
        }
    },
    watch: {
        divida: {
            handler(novaDivida) {
                if (novaDivida) {
                    this.carregarDividaParaEdicao(novaDivida);
                } else {
                    this.resetarFormulario();
                }
            },
            immediate: true
        }
    },
    methods: {
        fecharModal(){
            this.$emit('fechar-modal-divida')
        },
        salvarDivida() {
            if(!this.nome.trim()){
                alert('Por favor, digite um nome para a dívida')
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
            if(this.valorAtual && this.valorAtual !== '0,00' && valorAtual < 0){
                alert('Por favor, digite um valor atual válido')
                return
            }
            
            if(valorAtual > valorInicial){
                alert('O valor atual não pode ser maior que o valor inicial')
                return
            }

            if(!this.tipo){
                alert('Por favor, selecione o tipo de dívida')
                return
            }

            if(!this.dataVencimento){
                alert('Por favor, selecione a data de vencimento')
                return
            }

            const divida = {
                id: this.modoEdicao ? this.dividaEditando.id : Date.now(),
                nome: this.nome.trim(),
                tipo: this.tipo,
                credor: this.credor.trim() || null,
                valorInicial: valorInicial.toString(),
                valorAtual: valorAtual.toString(),
                dataVencimento: this.dataVencimento,
                observacoes: this.observacoes.trim() || null
            }
            
            console.log('Salvando dívida:', {
                modoEdicao: this.modoEdicao,
                divida: divida
            });
            
            if (this.modoEdicao) {
                this.$emit('atualizar-divida', divida);
            } else {
                this.$emit('adicionar-divida', divida);
            }
            
            this.resetarFormulario();
            this.fecharModal();
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
        },
        onValorInicialChange(event) {
            this.valorInicial = event.detail.numericValue;
        },
        onValorAtualChange(event) {
            this.valorAtual = event.detail.numericValue;
        },
        
        carregarDividaParaEdicao(divida) {
            this.modoEdicao = true;
            this.dividaEditando = divida;
            this.nome = divida.nome;
            this.tipo = divida.tipo;
            this.valorInicial = parseFloat(divida.valorInicial).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
            this.valorAtual = parseFloat(divida.valorAtual || 0).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
        },
        
        resetarFormulario() {
            this.nome = '';
            this.tipo = '';
            this.credor = '';
            this.valorInicial = '';
            this.valorAtual = '';
            this.dataVencimento = '';
            this.observacoes = '';
            this.modoEdicao = false;
            this.dividaEditando = null;
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
    padding: 1.25rem;
    max-width: 400px;
    width: 96vw;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.card-title {
    margin-bottom: 1rem;
    color: var(--text-primary);
    font-weight: 600;
    font-size: 1.1rem;
}

.form-label {
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: 0.3rem;
    font-size: 0.95rem;
}

.form-control {
    border: 1px solid var(--input-border);
    border-radius: 8px;
    padding: 0.6rem;
    font-size: 0.98rem;
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
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 1rem;
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
    min-height: 60px;
}

.d-flex.justify-content-between.w-100 {
    margin-top: 0.5rem;
    gap: 0.5rem;
}

@media (max-width: 600px) {
  .card {
    max-width: 98vw;
    padding: 0.7rem;
    min-width: 0;
    font-size: 0.97rem;
    max-height: 96vh;
  }
  .card-title {
    font-size: 1rem;
    margin-bottom: 0.7rem;
  }
  .form-label {
    font-size: 0.9rem;
  }
  .btn {
    font-size: 0.97rem;
    padding: 0.5rem 1rem;
  }
  .d-flex.justify-content-between.w-100 {
    flex-direction: column;
    gap: 0.4rem;
  }
}

/* Garantir rolagem interna do conteúdo do modal */
.card {
  overflow-y: auto;
}
</style> 
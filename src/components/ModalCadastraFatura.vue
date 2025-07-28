<template>
    <div class="fundo-modal">
        <div class="card-modal">
            <h5 class="card-title mb-1">{{ modoEdicao ? 'Editar Gasto' : 'Cadastrar Gasto' }}</h5>
            <div v-if="periodo" class="periodo-info">
                <small class="text-muted">
                    <i class="bi bi-calendar-event me-1"></i>
                    Período: {{ formatarPeriodo(periodo) }}
                </small>
            </div>
            <div class="overflow-auto" style="max-height: 60vh;">
                <div class="mb-3">
                    <label class="form-label">Descrição</label>
                    <input
                        v-model="descricao"
                        type="text"
                        class="form-control"
                        placeholder="Ex: Fatura de janeiro, Compras..."
                    >
                </div>

                <div class="mb-3">
                    <label for="" class="form-label">Valor Total da Compra</label>
                    <input 
                        type="text"
                        class="form-control"
                        v-model="valor"
                        placeholder="0,00"
                        @input="formatarComoMoeda"
                        >
                </div>
    
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div class="col-6">
                        <div >
                            <label class="form-label">Número <br>de Parcelas</label>
                            <select 
                                class="form-control"
                                v-model="numeroParcelas"
                                @change="calcularValorParcela"
                                >
                                <option value="1">1x</option>
                                <option value="2">2x</option>
                                <option value="3">3x</option>
                                <option value="4">4x</option>
                                <option value="5">5x</option>
                                <option value="6">6x</option>
                                <option value="7">7x</option>
                                <option value="8">8x</option>
                                <option value="9">9x</option>
                                <option value="10">10x</option>
                                <option value="11">11x</option>
                                <option value="12">12x</option>
                                <option value="">Mais</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-6">
                        <div >
                            <label class="form-label">Valor <br>Parcela</label>
                            <input 
                                type="text"
                                class="form-control"
                                v-model="valorParcela"
                                readonly
                                placeholder="0,00"
                                >
                        </div>
                    </div>
                </div>
    
                <div class="mb-3">
                    <label for="" class="form-label">Data da Compra</label>
                    <input 
                        type="date"
                        class="form-control"
                        v-model="dataVencimento"
                        >
                </div>
    
                <div class="mb-3">
                    <label for="" class="form-label">Cartão</label>
                    <select 
                        class="form-control"
                        v-model="cartaoId"
                        >
                        <option value="">Selecione um cartão</option>
                        <option v-for="cartao in cartoes" :key="cartao.id" :value="cartao.id">
                            {{ cartao.nome }} - {{ cartao.banco }}
                        </option>
                    </select>
                </div>
            </div>


            <div class="d-flex justify-content-between w-100">
                <button class="btn btn-primary" @click="salvarFatura">
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
    props: ['cartoes', 'periodo', 'fatura'],
    data(){
        return{
            descricao:'',
            valor:'',
            valorParcela:'',
            numeroParcelas: '1',
            dataVencimento: '',
            cartaoId: '',
            modoEdicao: false,
            faturaEditando: null
        }
    },
    watch: {
        fatura: {
            handler(novaFatura) {
                if (novaFatura) {
                    this.carregarFaturaParaEdicao(novaFatura);
                } else {
                    this.resetarFormulario();
                }
            },
            immediate: true
        }
    },
    methods: {
        fecharModal(){
            this.$emit('fechar-modal-fatura')
        },
        salvarFatura(){
            if(!this.descricao.trim()){
                alert('Por favor, digite a descrição')
                return
            }
            if(!this.valor || this.valor === '0,00'){
                alert('Por favor, digite um valor válido')
                return
            }
            
            const valorTotal = parseFloat(this.valor.replace(/\D/g, '')) / 100 || 0;
            if(valorTotal <= 0){
                alert('Por favor, digite um valor válido')
                return
            }

            if(!this.dataVencimento){
                alert('Por favor, selecione a data de vencimento')
                return
            }

            if(!this.cartaoId){
                alert('Por favor, selecione um cartão')
                return
            }

            const numeroParcelas = parseInt(this.numeroParcelas);
            const valorParcela = valorTotal / numeroParcelas;

            // Se for apenas 1 parcela, salva normalmente
            if (numeroParcelas === 1) {
                const fatura = {
                    id: this.modoEdicao ? this.faturaEditando.id : Date.now(),
                    descricao: this.descricao,
                    valor: valorParcela.toString(),
                    dataVencimento: this.dataVencimento,
                    cartaoId: this.cartaoId,
                    isParcelada: false
                }
                
                console.log('Salvando fatura única:', {
                    modoEdicao: this.modoEdicao,
                    fatura: fatura
                });
                
                if (this.modoEdicao) {
                    this.$emit('atualizar-fatura', fatura);
                } else {
                    this.$emit('adicionar-fatura', fatura);
                }
            } else {
                // Se for parcelada, gera múltiplas faturas
                const faturas = [];
                const dataBase = new Date(this.dataVencimento);
                
                for (let i = 1; i <= numeroParcelas; i++) {
                    const dataParcela = new Date(dataBase);
                    dataParcela.setMonth(dataParcela.getMonth() + (i - 1));
                    
                    const fatura = {
                        id: this.modoEdicao ? this.faturaEditando.id + i : Date.now() + i,
                        descricao: `${this.descricao} ${i}/${numeroParcelas}`,
                        valor: valorParcela.toString(),
                        dataVencimento: dataParcela.toISOString().split('T')[0],
                        cartaoId: this.cartaoId,
                        isParcelada: true,
                        parcelaAtual: i,
                        totalParcelas: numeroParcelas,
                        valorTotal: valorTotal.toString()
                    }
                    
                    faturas.push(fatura);
                }
                
                console.log('Salvando faturas parceladas:', {
                    modoEdicao: this.modoEdicao,
                    faturas: faturas
                });
                
                if (this.modoEdicao) {
                    // Para edição, remove a fatura antiga e adiciona as novas
                    this.$emit('remover-fatura-parcelada', this.faturaEditando);
                    faturas.forEach(fatura => {
                        this.$emit('adicionar-fatura', fatura);
                    });
                } else {
                    // Para nova compra, adiciona todas as parcelas
                    faturas.forEach(fatura => {
                        this.$emit('adicionar-fatura', fatura);
                    });
                }
            }
            
            this.resetarFormulario();
            this.fecharModal();
        },
        
        formatarPeriodo(periodo) {
            if (!periodo) return '';
            
            const [ano, mes] = periodo.split('-');
            const nomesMeses = [
                'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
            ];
            
            return `${nomesMeses[parseInt(mes) - 1]} ${ano}`;
        },
        
        formatarComoMoeda(e) {
            if (!e || !e.target) return;
            
            // Remove tudo que não é número
            let valorApenasDigitos = e.target.value.replace(/\D/g, '');

            if (!valorApenasDigitos) {
                this.valor = '0,00';
                return;
            }

            const valorNumerico = Number(valorApenasDigitos) / 100;

            this.valor = valorNumerico.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
        },

        calcularValorParcela() {
            if (this.valor && this.numeroParcelas) {
                const valorTotal = parseFloat(this.valor.replace(/\D/g, '')) / 100 || 0;
                const parcelas = parseInt(this.numeroParcelas);
                const valorParcela = valorTotal / parcelas;
                this.valorParcela = valorParcela.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                });
            } else {
                this.valorParcela = '';
            }
        },
        
        carregarFaturaParaEdicao(fatura) {
            console.log('Carregando fatura para edição:', fatura);
            this.modoEdicao = true;
            this.faturaEditando = fatura;
            
            // Se for uma fatura parcelada, extrai a descrição original
            if (fatura.isParcelada) {
                const match = fatura.descricao.match(/^(.+)\s+\d+\/\d+$/);
                this.descricao = match ? match[1] : fatura.descricao;
                this.numeroParcelas = fatura.totalParcelas.toString();
                this.valor = fatura.valorTotal;
            } else {
                this.descricao = fatura.descricao;
                this.numeroParcelas = '1';
                this.valor = fatura.valor;
            }
            
            this.dataVencimento = fatura.dataVencimento;
            this.cartaoId = fatura.cartaoId;
            this.calcularValorParcela();
            
            console.log('Formulário preenchido:', {
                descricao: this.descricao,
                valor: this.valor,
                numeroParcelas: this.numeroParcelas,
                dataVencimento: this.dataVencimento,
                cartaoId: this.cartaoId
            });
        },
        
        resetarFormulario() {
            this.descricao = '';
            this.valor = '';
            this.valorParcela = '';
            this.numeroParcelas = '1';
            this.dataVencimento = '';
            this.cartaoId = '';
            this.modoEdicao = false;
            this.faturaEditando = null;
        },
    }
}
</script>

<style scoped>


.card {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.form-control {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 0.75rem;
    font-size: 1rem;
    transition: border-color 0.2s ease;
}

.form-control:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
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
    background-color: #007bff;
    color: white;
}

.btn-primary:hover {
    background-color: #0056b3;
}

.btn-secondary {
    background-color: #6c757d;
    color: white;
}

.btn-secondary:hover {
    background-color: #545b62;
}

</style> 
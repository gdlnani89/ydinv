<template>
    <div class="fundo-modal">
        <div class="card bg1">
            <h5 class="card-title">{{ modoEdicao ? 'Editar Cartão' : 'Cadastrar Cartão' }}</h5>

            <div class="">
                <label class="form-label">Nome do Cartão</label>
                <input
                    v-model="nome"
                    type="text"
                    class="form-control"
                    placeholder="Ex: Visa, Mastercard, Nubank..."
                >
            </div>

            <div class="mb-3">
                <label class="form-label">Banco</label>
               
                <select v-model="banco" class="form-control">
                    <option value="" disabled selected>Selecione um banco</option>
                    <option v-for="conta in contas" :key="conta.id" :value="conta.nome">
                        {{ conta.nome }}
                    </option>
                    <option value="Outros">Outro</option>
                </select>
                <div v-if="!contas || contas.length === 0" class="text-danger mt-1" style="font-size:0.95rem;">Nenhuma conta disponível. Cadastre uma conta no dashboard.</div>
            </div>

            <div class="mb-3">
                <label class="form-label">Limite</label>
                <input 
                    type="text" 
                    class="form-control" 
                    v-model="limite" 
                    @input="formatarComoMoeda('limite', $event)"
                    placeholder="5000,00"
                >

            </div>

            <div class="d-flex justify-content-between align-items-center">
                <div class="col-6">
                    <div class="mb-3">
                        <label class="form-label">Dia <br>de Corte</label>
                        <input 
                            type="number"
                            class="form-control"
                            v-model="diaCorte"
                            min="1"
                            max="31"
                            placeholder="15"
                            >
                    </div>
                </div>
                <div class="col-6">
                    <div class="mb-3">
                        <label class="form-label">Dia de <br>Vencimento</label>
                        <input 
                            type="number"
                            class="form-control"
                            v-model="diaVencimento"
                            min="1"
                            max="31"
                            placeholder="20"
                            >
                    </div>
                </div>
            </div>

            <div class="mb-3">
                <label class="form-label">Cor do Cartão</label>
                <div class="cores-grid">
                    <div 
                        v-for="cor in cores" 
                        :key="cor.valor"
                        class="cor-item"
                        :style="{ backgroundColor: cor.valor }"
                        :class="{ 'selecionada': corSelecionada === cor.valor }"
                        @click="selecionarCor(cor.valor)"
                        :title="cor.nome"
                    ></div>
                </div>
            </div>

            <div class="d-flex justify-content-between w-100">
                <button class="btn btn-primary" @click="salvarCartao">
                    {{ modoEdicao ? 'Atualizar' : 'Adicionar' }}
                </button>
                <button @click="fecharModal" class="btn btn-secondary">Fechar</button>
            </div>
        </div>
    </div>
</template>

<script>
import { useMoeda } from '../composables/useMoeda';
export default {
    props: ['cartao'],
    data() {
        return {
            nome: '',
            banco: '',
            limite: '',
            contas: JSON.parse(localStorage.getItem('contas')) || [],
            diaCorte: '',
            diaVencimento: '',
            corSelecionada: '#007bff',
            modoEdicao: false,
            cartaoEditando: null,
            cores: [
                { nome: 'Azul', valor: '#007bff' },
                { nome: 'Verde', valor: '#28a745' },
                { nome: 'Vermelho', valor: '#dc3545' },
                { nome: 'Laranja', valor: '#fd7e14' },
                { nome: 'Roxo', valor: '#6f42c1' },
                { nome: 'Rosa', valor: '#e83e8c' },
                { nome: 'Teal', valor: '#20c997' },
                { nome: 'Cinza', valor: '#6c757d' },
                { nome: 'Amarelo', valor: '#ffc107' },
                { nome: 'Indigo', valor: '#6610f2' },
                { nome: 'Cyan', valor: '#17a2b8' },
                { nome: 'Marrom', valor: '#8b4513' }
            ]
        }
    },
    watch: {
        cartao: {
            handler(novoCartao) {
                if (novoCartao) {
                    this.carregarCartaoParaEdicao(novoCartao);
                } else {
                    this.resetarFormulario();
                }
            },
            immediate: true
        }
    },
    mounted() {
        console.log(this.contas);
        
    },
    methods: {
        selecionarCor(cor) {
            this.corSelecionada = cor;
        },
        fecharModal() {
            this.$emit('fechar-modal-cartao')
        },
        salvarCartao() {
            if (!this.nome.trim()) {
                alert('Por favor, digite o nome do cartão');
                return;
            }

            if (!this.banco.trim()) {
                alert('Por favor, digite o nome do banco');
                return;
            }

            if (!this.diaCorte || this.diaCorte < 1 || this.diaCorte > 31) {
                alert('Por favor, digite um dia de corte válido (1-31)');
                return;
            }

            if (!this.diaVencimento || this.diaVencimento < 1 || this.diaVencimento > 31) {
                alert('Por favor, digite um dia de vencimento válido (1-31)');
                return;
            }

            const cartao = {
                id: this.modoEdicao ? this.cartaoEditando.id : Date.now(),
                nome: this.nome.trim(),
                banco: this.bancos,
                limite : parseFloat(this.limite.toString().replace(',', '.')),
                diaCorte: parseInt(this.diaCorte),
                diaVencimento: parseInt(this.diaVencimento),
                cor: this.corSelecionada
            };
            
            console.log('Salvando cartão:', {
                modoEdicao: this.modoEdicao,
                cartao: cartao
            });
            
            // Emite o evento apropriado baseado no modo
            if (this.modoEdicao) {
                console.log('Emitindo evento: atualizar-cartao');
                this.$emit('atualizar-cartao', cartao);
            } else {
                console.log('Emitindo evento: adicionar-cartao');
                this.$emit('adicionar-cartao', cartao);
            }
            
            this.resetarFormulario();
            this.fecharModal();
        },
        
        carregarCartaoParaEdicao(cartao) {
            console.log('Carregando cartão para edição:', cartao);
            this.modoEdicao = true;
            this.cartaoEditando = cartao;
            this.nome = cartao.nome;
            this.banco = cartao.banco;
            this.limite = cartao.limite.toFixed(2).replace('.', ',');
            this.diaCorte = cartao.diaCorte;
            this.diaVencimento = cartao.diaVencimento;
            this.corSelecionada = cartao.cor;
            
        },
        
        resetarFormulario() {
            this.nome = '';
            this.banco = '';
            this.limite = '';
            this.diaCorte = '';
            this.diaVencimento = '';
            this.corSelecionada = '#007bff';
            this.modoEdicao = false;
            this.cartaoEditando = null;
        },
        onBancoChange() {
            if (this.banco !== 'Outros') {
                this.bancoOutros = '';
            }
        },
        ...useMoeda()
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
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
}

.card {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.form-label {
    font-weight: 500;
    color: #555;
    margin-bottom: 0.5rem;
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

.cores-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 8px;
    margin-top: 8px;
}

.cor-item {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    border: 3px solid transparent;
    transition: all 0.2s ease;
    position: relative;
}

.cor-item:hover {
    transform: scale(1.1);
    border-color: #333;
}

.cor-item.selecionada {
    border-color: #333;
    transform: scale(1.1);
}

.cor-item.selecionada::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-weight: bold;
    font-size: 1.2rem;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}
</style> 
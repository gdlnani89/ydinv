<template>
    <div class="fundo-modal">
        <div class="card-modal">
            <h5 class="card-title mb-1">{{ modoEdicao ? 'Editar Despesa' : 'Cadastrar Despesa' }}</h5>
            
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
                        placeholder="Ex: Conta de luz, Aluguel..."
                    >
                </div>
    
                <div class="mb-3">
                    <label class="form-label">Tipo</label>
                    <select class="form-control" v-model="tipo">
                        <option v-for="t in tipos" :key="t" :value="t">{{ t }}</option>
                    </select>
                </div>
    
                <div class="mb-3">
                    <label for="" class="form-label">Valor</label>
                    <input 
                        type="text"
                        class="form-control"
                        v-model="valor"
                        placeholder="0,00"
                        @input="formatarComoMoeda"
                        >
                </div>
    
                <div class="mb-3">
                    <label for="" class="form-label">Dia</label>
                    <input 
                        type="text"
                        class="form-control"
                        v-model="dia"
                        >
                </div>
    
                <div class="mb-3">
                    <label for="" class="form-label">Conta</label>
                    <select 
                        class="form-control"
                        v-model="conta"
                        >
                        <option v-for="conta in contas" :key="conta.id" :value="conta.id">{{ conta.nome }}</option>
                    </select>
                </div>
            </div>
            <div class="d-flex justify-content-between w-100 border-top pt-3">
                <button class="btn btn-primary" @click="salvarDespesa">
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
    props: ['contas', 'periodo', 'despesa'],
    data(){
        return{
            descricao:'',
            tipos: [
                'Familia',
                'Investimentos',
                'Mercado',
                'Bobagens',
                'Transporte',
                'Saúde',
                'Educação',
                'Lazer',
                'Moradia',
                'Serviços',
                'Namorada',
                'Viagem',
                'Outros'
            ],
            tipo: 'Mercado', // Valor inicial para o tipo
            valor:'',
            dia: new Date().getDate(),
            conta: '',
            modoEdicao: false,
            despesaEditando: null
        }
    },
    computed: {
        mesSelecionado() {
            return this.periodo ? this.periodo.split('-')[1] : '';
        },
        anoSelecionado() {
            return this.periodo ? this.periodo.split('-')[0] : '';
        }
    },
    watch: {
        despesa: {
            handler(novaDespesa) {
                if (novaDespesa) {
                    this.carregarDespesaParaEdicao(novaDespesa);
                } else {
                    this.resetarFormulario();
                }
            },
            immediate: true
        }
    },
    methods: {
        fecharModal(){
            this.$emit('fechar-modal-despesa')
        },
        salvarDespesa() {
            if(!this.descricao.trim()){
                alert('Por favor, digite a descrição')
                return
            }
            if(!this.valor || this.valor === '0,00'){
                alert('Por favor, digite um valor válido')
                return
            }
            if(!this.tipo.trim()){
                alert('Por favor, selecione um tipo')
                return
            }
            
            const valorNumerico = parseFloat(this.valor.replace(/\D/g, '')) / 100 || 0;
            if(valorNumerico <= 0){
                alert('Por favor, digite um valor válido')
                return
            }

            if(!this.conta){
                alert('Por favor, selecione uma conta')
                return
            }

            // Na edição, usa o período da despesa original; na criação, usa o período selecionado
            let periodoParaUsar = this.periodo;
            if (this.modoEdicao && this.despesaEditando) {
                // Extrai o período da data da despesa sendo editada de forma segura
                const dataParts = this.despesaEditando.data.split('-');
                const ano = dataParts[0];
                const mes = dataParts[1];
                periodoParaUsar = `${ano}-${mes}`;
            }

            if(!periodoParaUsar){
                alert('Por favor, selecione um período')
                return
            }

            // Extrai ano e mês do período
            const [anoSelecionado, mesSelecionado] = periodoParaUsar.split('-');

            // Monta a data completa no formato YYYY-MM-DD
            const dataCompleta = `${anoSelecionado}-${mesSelecionado}-${String(this.dia).padStart(2, '0')}`;

            const despesa = {
                id: this.modoEdicao ? this.despesaEditando.id : Date.now(),
                descricao: this.descricao,
                tipo: this.tipo,
                valor: valorNumerico.toString(),
                data: dataCompleta,
                contaId: this.conta
            }
            
            // Emite o evento apropriado baseado no modo
            if (this.modoEdicao) {
                console.log('Emitindo evento: atualizar-despesa');
                this.$emit('atualizar-despesa', despesa);
            } else {
                console.log('Emitindo evento: adicionar-despesa');
                this.$emit('adicionar-despesa', despesa);
            }
            
            this.resetarFormulario();
            this.fecharModal();
        },
        resetDespesa(){
            this.resetarFormulario();
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
        
        carregarDespesaParaEdicao(despesa) {
            console.log('Carregando despesa para edição:', despesa);
            this.modoEdicao = true;
            this.despesaEditando = despesa;
            this.descricao = despesa.descricao;
            this.valor = parseFloat(despesa.valor).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
            this.conta = despesa.contaId;
            
            // Extrai o dia da data de forma segura (evita problemas de fuso horário)
            const dataParts = despesa.data.split('-');
            this.dia = parseInt(dataParts[2]);
            
            console.log('Formulário preenchido:', {
                descricao: this.descricao,
                valor: this.valor,
                conta: this.conta,
                dia: this.dia
            });
        },
        
        resetarFormulario() {
            this.descricao = ''; // Reseta para o primeiro tipo
            this.valor = '';
            this.dia = new Date().getDate();
            this.conta = '';
            this.modoEdicao = false;
            this.despesaEditando = null;
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

</style> 
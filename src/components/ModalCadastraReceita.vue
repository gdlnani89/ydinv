<template>
    <div class="fundo-modal">
        <div class="card">
            <h5 class="card-title">{{ modoEdicao ? 'Editar Receita' : 'Cadastrar Receita' }}</h5>
            
            <!-- Mostra o período selecionado -->
            <div v-if="periodo" class="periodo-info mb-3">
                <small class="text-muted">
                    <i class="bi bi-calendar-event me-1"></i>
                    Período: {{ formatarPeriodo(periodo) }}
                </small>
            </div>

            <div class="mb-3">
                <label class="form-label">Descrição</label>
                <input
                    v-model="descricao"
                    type="text"
                    class="form-control"
                    placeholder="Ex: Pix, Salário..."
                >
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
            <div class="d-flex justify-content-between w-100">
                <button class="btn btn-primary" @click="salvarReceita">
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
    props: ['contas', 'periodo', 'receita'],
    data(){
        return{
            descricao:'',
            valor:'',
            dia: new Date().getDate(),
            conta: '',
            modoEdicao: false,
            receitaEditando: null
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
        receita: {
            handler(novaReceita) {
                if (novaReceita) {
                    this.carregarReceitaParaEdicao(novaReceita);
                } else {
                    this.resetarFormulario();
                }
            },
            immediate: true
        }
    },
    methods: {
        fecharModal(){
            this.$emit('fechar-modal-receita')
        },
        salvarReceita() {
            if(!this.descricao.trim()){
                alert('Por favor, digite a descrição')
                return
            }
            if(!this.valor || this.valor === '0,00'){
                alert('Por favor, digite um valor válido')
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

            // Na edição, usa o período da receita original; na criação, usa o período selecionado
            let periodoParaUsar = this.periodo;
            if (this.modoEdicao && this.receitaEditando) {
                // Extrai o período da data da receita sendo editada de forma segura
                const dataParts = this.receitaEditando.data.split('-');
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

            const receita = {
                id: this.modoEdicao ? this.receitaEditando.id : Date.now(),
                descricao: this.descricao,
                valor: valorNumerico.toString(),
                data: dataCompleta,
                contaId: this.conta
            }
            
            console.log('Salvando receita:', {
                modoEdicao: this.modoEdicao,
                receita: receita
            });
            
            // Emite o evento apropriado baseado no modo
            if (this.modoEdicao) {
                console.log('Emitindo evento: atualizar-receita');
                this.$emit('atualizar-receita', receita);
            } else {
                console.log('Emitindo evento: adicionar-receita');
            this.$emit('adicionar-receita', receita);
            }
            
            this.resetarFormulario();
            this.fecharModal();
        },
        resetReceita(){
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
        
        carregarReceitaParaEdicao(receita) {
            this.modoEdicao = true;
            this.receitaEditando = receita;
            this.descricao = receita.descricao;
            this.valor = parseFloat(receita.valor).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
            this.conta = receita.contaId;
            
            // Extrai o dia da data de forma segura (evita problemas de fuso horário)
            const dataParts = receita.data.split('-');
            this.dia = parseInt(dataParts[2]);
            
            console.log('Formulário preenchido:', {
                descricao: this.descricao,
                valor: this.valor,
                conta: this.conta,
                dia: this.dia
            });
        },
        
        resetarFormulario() {
            this.descricao = '';
            this.valor = '';
            this.dia = new Date().getDate();
            this.conta = '';
            this.modoEdicao = false;
            this.receitaEditando = null;
        },
        
        // Método removido - agora usa watcher
    }
}
</script>

<style scoped>
.periodo-info {
    background: #e3f2fd;
    border-radius: 6px;
    padding: 0.5rem;
    border-left: 3px solid #2196f3;
}
</style>
<script setup>
import { ref, onMounted } from 'vue';
import { initializeTheme } from './utils/themeManager.js';
import TheSideBar from './components/TheSideBar.vue';
import TheBottomNav from './components/TheBottomNav.vue';
import DashBoardView from './components/DashBoardView.vue';
import ExtratoView from './components/ExtratoView.vue';
import ReceitasView from './components/ReceitasView.vue';
import DespesasView from './components/DespesasView.vue';
import InvestimentoView from './components/InvestimentoView.vue';
import DividasView from './components/DividasView.vue';
import ControlesView from './components/ControlesView.vue';
import FaturasView from './components/FaturasView.vue';
import ModalGerenciaContas from './components/ModalGerenciaContas.vue';
import ModalCadastraReceita from './components/ModalCadastraReceita.vue';
import ModalCadastraDespesa from './components/ModalCadastraDespesa.vue';
import ModalCadastraCartao from './components/ModalCadastraCartao.vue';
import ModalCadastraFatura from './components/ModalCadastraFatura.vue';
import ModalCadastraInvestimento from './components/ModalCadastraInvestimento.vue';
import ModalCadastraDivida from './components/ModalCadastraDivida.vue';
import ModalGerenciarCartoes from './components/ModalGerenciarCartoes.vue';
import PWAUpdatePrompt from './components/PWAUpdatePrompt.vue';

const currentSection = ref('dashboard');

function showSection(section) {
  currentSection.value = section;
}

const contas = ref(JSON.parse(localStorage.getItem('contas') || '[]'))
const receitas = ref(JSON.parse(localStorage.getItem('receitas') || '[]'))
const despesas = ref(JSON.parse(localStorage.getItem('despesas') || '[]'))
const cartoes = ref(JSON.parse(localStorage.getItem('cartoes') || '[]'))
const faturas = ref(JSON.parse(localStorage.getItem('faturas') || '[]'))
const investimentos = ref(JSON.parse(localStorage.getItem('investimentos') || '[]'))
const dividas = ref(JSON.parse(localStorage.getItem('dividas') || '[]'))
const modalGerenciaContas = ref(false)
const modalReceita = ref(false)
const modalDespesa = ref(false)
const modalCartao = ref(false)
const modalFatura = ref(false)
const modalInvestimento = ref(false)
const modalDivida = ref(false)
const modalGerenciarCartoes = ref(false)
const periodoAtual = ref('')
const receitaEditando = ref(null)
const despesaEditando = ref(null)
const cartaoEditando = ref(null)
const faturaEditando = ref(null)
const investimentoEditando = ref(null)
const dividaEditando = ref(null)

function adicionarConta(novaConta){
  contas.value.push(novaConta);
  localStorage.setItem('contas', JSON.stringify(contas.value))
}
function adicionarReceita(novaReceita){
  receitas.value.push(novaReceita)
  localStorage.setItem('receitas', JSON.stringify(receitas.value))
}

function adicionarDespesa(novaDespesa){
  despesas.value.push(novaDespesa)
  localStorage.setItem('despesas', JSON.stringify(despesas.value))
}

function adicionarCartao(novoCartao){
  cartoes.value.push(novoCartao)
  localStorage.setItem('cartoes', JSON.stringify(cartoes.value))
}

function adicionarFatura(novaFatura){
  faturas.value.push(novaFatura)
  localStorage.setItem('faturas', JSON.stringify(faturas.value))
}

function adicionarInvestimento(novoInvestimento){
  investimentos.value.push(novoInvestimento)
  localStorage.setItem('investimentos', JSON.stringify(investimentos.value))
}

function adicionarDivida(novaDivida){
  dividas.value.push(novaDivida)
  localStorage.setItem('dividas', JSON.stringify(dividas.value))
}

function atualizarConta(contaAtualizada){
  const index = contas.value.findIndex(conta => conta.id === contaAtualizada.id)
  if (index !== -1) {
    contas.value[index] = contaAtualizada
    localStorage.setItem('contas', JSON.stringify(contas.value))
  }
}

function excluirConta(contaId){
  contas.value = contas.value.filter(conta => conta.id !== contaId)
  localStorage.setItem('contas', JSON.stringify(contas.value))
}

function atualizarCartao(cartaoAtualizado){
  const index = cartoes.value.findIndex(cartao => cartao.id === cartaoAtualizado.id)
  if (index !== -1) {
    cartoes.value[index] = cartaoAtualizado
    localStorage.setItem('cartoes', JSON.stringify(cartoes.value))
  }
}

function excluirCartao(cartaoId){
  cartoes.value = cartoes.value.filter(cartao => cartao.id !== cartaoId)
  localStorage.setItem('cartoes', JSON.stringify(cartoes.value))
}

function atualizarFatura(faturaAtualizada){
  const index = faturas.value.findIndex(fatura => fatura.id === faturaAtualizada.id)
  if (index !== -1) {
    faturas.value[index] = faturaAtualizada
    localStorage.setItem('faturas', JSON.stringify(faturas.value))
  }
}

function excluirFatura(faturaId){
  faturas.value = faturas.value.filter(fatura => fatura.id !== faturaId)
  localStorage.setItem('faturas', JSON.stringify(faturas.value))
}

function atualizarInvestimento(investimentoAtualizado){
  const index = investimentos.value.findIndex(inv => inv.id === investimentoAtualizado.id)
  if (index !== -1) {
    investimentos.value[index] = investimentoAtualizado
    localStorage.setItem('investimentos', JSON.stringify(investimentos.value))
  }
}

function excluirInvestimento(investimentoId){
  investimentos.value = investimentos.value.filter(inv => inv.id !== investimentoId)
  localStorage.setItem('investimentos', JSON.stringify(investimentos.value))
}

function atualizarDivida(dividaAtualizada){
  const index = dividas.value.findIndex(div => div.id === dividaAtualizada.id)
  if (index !== -1) {
    dividas.value[index] = dividaAtualizada
    localStorage.setItem('dividas', JSON.stringify(dividas.value))
  }
}

function excluirDivida(dividaId){
  dividas.value = dividas.value.filter(div => div.id !== dividaId)
  localStorage.setItem('dividas', JSON.stringify(dividas.value))
}

function removerFaturaParcelada(faturaEditando){
  // Remove todas as faturas relacionadas à compra parcelada
  if (faturaEditando.isParcelada) {
    faturas.value = faturas.value.filter(fatura => 
      !(fatura.isParcelada && 
        fatura.descricao.split(' ').slice(0, -1).join(' ') === faturaEditando.descricao.split(' ').slice(0, -1).join(' ') &&
        fatura.cartaoId === faturaEditando.cartaoId)
    );
  } else {
    faturas.value = faturas.value.filter(fatura => fatura.id !== faturaEditando.id);
  }
  localStorage.setItem('faturas', JSON.stringify(faturas.value))
}

function abrirModalGerenciaContas(){
  modalGerenciaContas.value = true
}

function fecharModalGerenciaContas(){
  modalGerenciaContas.value = false
}

function fecharModalReceita(){
  modalReceita.value = false
  receitaEditando.value = null // Limpa a receita em edição
}

function fecharModalDespesa(){
  modalDespesa.value = false
  despesaEditando.value = null // Limpa a despesa em edição
}

function fecharModalCartao(){
  modalCartao.value = false
  cartaoEditando.value = null // Limpa o cartão em edição
}

function fecharModalFatura(){
  modalFatura.value = false
  faturaEditando.value = null // Limpa a fatura em edição
}

function fecharModalInvestimento(){
  modalInvestimento.value = false
  investimentoEditando.value = null // Limpa o investimento em edição
}

function fecharModalDivida(){
  modalDivida.value = false
  dividaEditando.value = null // Limpa a dívida em edição
}

function abrirModalCartao(){
  modalCartao.value = true
}

function gerenciarCartoes(){
  // Por enquanto, apenas abre o modal de cartão
  // Futuramente pode abrir uma tela de gerenciamento
  modalGerenciarCartoes.value = true
}

function abrirModalCadastroConta(){
  modalGerenciaContas.value = false
  // Abre o modal de cadastro de conta no dashboard
  currentSection.value = 'dashboard'
  // Emite um evento para abrir o modal de cadastro
  setTimeout(() => {
    // Usa setTimeout para garantir que a mudança de seção aconteça primeiro
    window.dispatchEvent(new CustomEvent('abrir-modal-cadastro-conta'))
  }, 100)
}

function editarReceita(receita){
  console.log('Editando receita:', receita);
  // Define a receita a ser editada e abre o modal
  receitaEditando.value = receita
  modalReceita.value = true
}

function excluirReceita(receitaId){
  // Remove a receita do array
  receitas.value = receitas.value.filter(receita => receita.id !== receitaId)
  // Atualiza o localStorage
  localStorage.setItem('receitas', JSON.stringify(receitas.value))
}

function atualizarReceita(receitaAtualizada){
  console.log('Atualizando receita:', receitaAtualizada);
  // Encontra e atualiza a receita no array
  const index = receitas.value.findIndex(receita => receita.id === receitaAtualizada.id)
  if (index !== -1) {
    receitas.value[index] = receitaAtualizada
    localStorage.setItem('receitas', JSON.stringify(receitas.value))
    console.log('Receita atualizada com sucesso');
  } else {
    console.error('Receita não encontrada para atualização');
  }
}

function editarDespesa(despesa){
  console.log('Editando despesa:', despesa);
  // Define a despesa a ser editada e abre o modal
  despesaEditando.value = despesa
  modalDespesa.value = true
}

function excluirDespesa(despesaId){
  // Remove a despesa do array
  despesas.value = despesas.value.filter(despesa => despesa.id !== despesaId)
  // Atualiza o localStorage
  localStorage.setItem('despesas', JSON.stringify(despesas.value))
}

function atualizarDespesa(despesaAtualizada){
  console.log('Atualizando despesa:', despesaAtualizada);
  // Encontra e atualiza a despesa no array
  const index = despesas.value.findIndex(despesa => despesa.id === despesaAtualizada.id)
  if (index !== -1) {
    despesas.value[index] = despesaAtualizada
    localStorage.setItem('despesas', JSON.stringify(despesas.value))
    console.log('Despesa atualizada com sucesso');
  } else {
    console.error('Despesa não encontrada para atualização');
  }
}

function editarCartao(cartao){
  console.log('Editando cartão:', cartao);
  cartaoEditando.value = cartao
  modalCartao.value = true
}

function editarFatura(fatura){
  console.log('Editando fatura:', fatura);
  faturaEditando.value = fatura
  modalFatura.value = true
}

function editarInvestimento(investimento){
  console.log('Editando investimento:', investimento);
  investimentoEditando.value = investimento
  modalInvestimento.value = true
}

function editarDivida(divida){
  console.log('Editando dívida:', divida);
  dividaEditando.value = divida
  modalDivida.value = true
}

function abrirModalGerenciarCartoes() {
  modalGerenciarCartoes.value = true
}
function fecharModalGerenciarCartoes() {
  modalGerenciarCartoes.value = false
}

// Inicializa o tema quando o app carrega
onMounted(() => {
  initializeTheme();
});
</script>

<template>
  <div class="d-flex">
    <TheSideBar :menu-ativo="currentSection" @navigate="showSection"/>
    <TheBottomNav @navigate="showSection"/>

    <main class="main-content w-100">
      <DashBoardView 
        :contas="contas"
        :receitas="receitas"
        :despesas="despesas"
        @adicionar-conta="adicionarConta"
        @gerenciar-contas="abrirModalGerenciaContas"
        @abrir-modal-cartao="abrirModalCartao"
        @gerenciar-cartoes="gerenciarCartoes"
        v-if="currentSection === 'dashboard'" 
        @navigate="showSection"
      />

      <ExtratoView 
        v-if="currentSection === 'extrato'"
        :receitas="receitas"
        :despesas="despesas"
        :contas="contas"
      />

      <ReceitasView 
        :contas="contas" 
        :receitas="receitas"
        @adicionar-receita="adicionarReceita"
        @editar-receita="editarReceita"
        @excluir-receita="excluirReceita"
        v-if="currentSection === 'receitas'" 
      />

      <DespesasView 
        :contas="contas" 
        :despesas="despesas"
        @adicionar-despesa="adicionarDespesa"
        @editar-despesa="editarDespesa"
        @excluir-despesa="excluirDespesa"
        v-if="currentSection === 'despesas'" 
      />
      <FaturasView 
        :cartoes="cartoes"
        :faturas="faturas"
        @adicionar-cartao="adicionarCartao"
        @editar-cartao="editarCartao"
        @excluir-cartao="excluirCartao"
        @adicionar-fatura="adicionarFatura"
        @editar-fatura="editarFatura"
        @excluir-fatura="excluirFatura"
        @remover-fatura-parcelada="removerFaturaParcelada"
        v-if="currentSection === 'faturas'" 
      />
      <InvestimentoView 
        :investimentos="investimentos"
        @adicionar-investimento="adicionarInvestimento"
        @editar-investimento="editarInvestimento"
        @excluir-investimento="excluirInvestimento"
        v-if="currentSection === 'investimentos'" 
      />
      <DividasView 
        :dividas="dividas"
        @adicionar-divida="adicionarDivida"
        @editar-divida="editarDivida"
        @excluir-divida="excluirDivida"
        v-if="currentSection === 'dividas'" 
      />
      <ControlesView v-if="currentSection === 'controles'" />
    </main>

    <!-- Modal de Gerenciamento de Contas -->
    <ModalGerenciaContas 
      v-show="modalGerenciaContas"
      :contas="contas"
      @fechar-modal="fecharModalGerenciaContas"
      @atualizar-conta="atualizarConta"
      @excluir-conta="excluirConta"
      @abrir-modal-cadastro="abrirModalCadastroConta"
    />

    <!-- Modal de Cadastro/Edição de Receita -->
    <ModalCadastraReceita 
      v-show="modalReceita"
      :contas="contas"
      :periodo="periodoAtual"
      :receita="receitaEditando"
      @fechar-modal-receita="fecharModalReceita"
      @adicionar-receita="adicionarReceita"
      @atualizar-receita="atualizarReceita"
    />

    <!-- Modal de Cadastro/Edição de Despesa -->
    <ModalCadastraDespesa 
      v-show="modalDespesa"
      :contas="contas"
      :periodo="periodoAtual"
      :despesa="despesaEditando"
      @fechar-modal-despesa="fecharModalDespesa"
      @adicionar-despesa="adicionarDespesa"
      @atualizar-despesa="atualizarDespesa"
    />

    <!-- Modal de Cadastro/Edição de Cartão -->
    <ModalCadastraCartao 
      v-show="modalCartao"
      :cartao="cartaoEditando"
      @fechar-modal-cartao="fecharModalCartao"
      @adicionar-cartao="adicionarCartao"
      @atualizar-cartao="atualizarCartao"
    />

    <!-- Modal de Cadastro/Edição de Fatura -->
    <ModalCadastraFatura 
      v-show="modalFatura"
      :cartoes="cartoes"
      :periodo="periodoAtual"
      :fatura="faturaEditando"
      @fechar-modal-fatura="fecharModalFatura"
      @adicionar-fatura="adicionarFatura"
      @atualizar-fatura="atualizarFatura"
      @remover-fatura-parcelada="removerFaturaParcelada"
    />

    <!-- Modal de Cadastro/Edição de Investimento -->
    <ModalCadastraInvestimento 
      v-show="modalInvestimento"
      :investimento="investimentoEditando"
      @fechar-modal-investimento="fecharModalInvestimento"
      @adicionar-investimento="adicionarInvestimento"
      @atualizar-investimento="atualizarInvestimento"
    />

    <!-- Modal de Cadastro/Edição de Dívida -->
    <ModalCadastraDivida 
      v-show="modalDivida"
      :divida="dividaEditando"
      @fechar-modal-divida="fecharModalDivida"
      @adicionar-divida="adicionarDivida"
      @atualizar-divida="atualizarDivida"
    />

    <!-- Modal de Gerenciamento de Cartões -->
    <ModalGerenciarCartoes
      v-show="modalGerenciarCartoes"
      :cartoes="cartoes"
      @fechar="fecharModalGerenciarCartoes"
      @adicionar-cartao="adicionarCartao"
      @atualizar-cartao="atualizarCartao"
      @excluir-cartao="excluirCartao"
    />

    <!-- PWA Update Prompt -->
    <PWAUpdatePrompt />
  </div>

</template>

<style scoped>

</style>

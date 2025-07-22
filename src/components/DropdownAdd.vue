<template>
  <div class="dropdown add">
        <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          <i class="bi bi-three-dots-vertical"></i>
        </button>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" @click="abrirmodal">Adicionar Conta</a></li>
          <li><a class="dropdown-item" @click="gerenciarContas">Gerenciar Contas</a></li>
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" @click="abrirModalCartao">Adicionar Cartão Crédito</a></li>
          <li><a class="dropdown-item" @click="gerenciarCartoes">Gerenciar Cartões de Crédito</a></li>
        </ul>
      </div> 
</template>

<script>
export default {
    methods:{
        abrirmodal(){
            this.$emit('abrir-cadastro-conta')
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
    }
}
</script>

<style>
.add{
    margin-right: 10px;
}
</style>
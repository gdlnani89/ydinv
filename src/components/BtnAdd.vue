<template>
  <button @click="abrirModal" class="add-btn btn btn-primary">
    <i class="bi bi-plus"></i>
  </button> 
</template>

<script>
export default {
    props: {
        tipo: {
            type: String,
            default: 'receita'
        }
    },
    methods: {
        abrirModal(){
            if (this.tipo === 'despesa') {
                this.$emit('abrir-modal-despesa')
            } else if (this.tipo === 'cartao') {
                this.$emit('abrir-modal-cartao')
            } else if (this.tipo === 'fatura') {
                this.$emit('abrir-modal-fatura')
            } else if (this.tipo === 'investimento') {
                this.$emit('abrir-modal-investimento')
            } else if (this.tipo === 'divida') {
                this.$emit('abrir-modal-divida')
            } else if (this.tipo === 'lancamento') {
                this.$emit('abrir-modal-lancamento')
            } else {
            this.$emit('abrir-modal-receita')
            }
        }
    }
}
</script>

<style>
@media (max-width: 768px){
    .add-btn{
        width: 50px;
        height: 50px;
        display: flex !important;
        align-items: center;
        justify-content: center;
        border-radius: 50% !important;
        padding: 0.2rem 0.5rem;
        margin-bottom: 0.5rem;
        position: fixed;
        bottom: 80px;
        right: 10px;
        margin: 0.5rem;
        z-index: 1000;
        box-shadow: 3px 5px 10px #888888;
    }
    .add-btn i{
        font-size: 2.0rem;
    }
}
@media (min-width: 769px){
    .add-btn{
        display: none !important;
    }
}
</style>
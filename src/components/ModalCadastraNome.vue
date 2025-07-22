<template>
    <div class="fundo-modal">
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">Olá como está?</h5>
                <p class="card-text">Por favor, me diga como você quer ser chamado.</p>
                <input v-model="nome" type="text" class="form-control mb-2" placeholder="Digite aqui...">
                <button @click="salvaNome" class="btn btn-primary">Salvar</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:['modal'],
    data(){
        return{
            nome : ''
        }
    },
    methods:{
        salvaNome(){
            localStorage.setItem('titular', this.nome)
            this.$emit('fechar-modal')
        } 
    }
}
</script>

<style>

</style>
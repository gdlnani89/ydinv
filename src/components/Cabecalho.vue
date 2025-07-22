<template>
  <div class="cabecalho">
    <h2>{{ titulo }}</h2>
  </div>
</template>

<script>
export default {
    props: {
        titulo: String,
        descricao: String
    }
}
</script>

<style>
.cabecalho {
    padding: 0 20px;
    width: 100%;
    margin-bottom: 10px;
}

.cabecalho h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
    color: #333;
}

.cabecalho p {
    font-size: 0.8rem;
    color: #666;
    margin: 0;
}

</style>
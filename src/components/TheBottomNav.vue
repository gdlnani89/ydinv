<template>
<nav class="bottom-nav">
    <a href="#" class="nav-link" @click.prevent="showSection('dashboard')"><i class="bi bi-grid-1x2-fill"></i><span>Dashboard</span></a>
    <a href="#" class="nav-link" @click.prevent="showSection('extrato')"><i class="bi bi-list-columns"></i><span>Extrato</span></a>
    <!-- <a href="#" class="nav-link" @click.prevent="showSection('receitas')"><i class="bi bi-arrow-up-circle-fill"></i><span>Receitas</span></a> -->
    <!-- <a href="#" class="nav-link" @click.prevent="showSection('despesas')"><i class="bi bi-arrow-down-circle-fill"></i><span>Débitos</span></a> -->
    <!-- <a href="#" class="nav-link" @click.prevent="showSection('faturas')"><i class="bi bi-credit-card-fill"></i><span>Faturas</span></a> -->
    <a href="#" class="nav-link" @click.prevent="showSection('investimentos')"><i class="bi bi-bar-chart-line-fill"></i><span>Invest.</span></a>
    <a href="#" class="nav-link" @click.prevent="showSection('dividas')"><i class="bi bi-table"></i><span>Dívidas</span></a>
    <a href="#" class="nav-link" @click.prevent="showSection('controles')"><i class="bi bi-calendar2-plus-fill"></i><span>Controles</span></a>
</nav>  
</template>

<script setup>
const emit = defineEmits(['navigate']);

function showSection(section) {
    emit('navigate', section);
}
</script>

<style>
@media (max-width: 768px) {
.bottom-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.3rem;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    border-top: 1px solid var(--border-color);
    box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.15);
    z-index: 100;
    background-color: var(--card-bg);
}

.bottom-nav .nav-link {
    font-size: 0.65rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    text-align: center;
    padding: 0.5rem;
    border-radius: 8px;
    transition: all 0.3s ease;
}
    .bottom-nav .nav-link i {
        font-size: 1.1rem;
    }
}
@media (min-width: 769px) {
    .bottom-nav {
        display: none;
    }
}
</style>
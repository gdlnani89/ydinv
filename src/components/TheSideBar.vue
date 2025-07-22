<template>
<aside class="sidebar">
    <div class="sidebar-header">
        <h1 class="logo">Ydin</h1>
    </div>
    <nav class="sidebar-nav">
        <a href="#" class="nav-link" :class="{'active': menuAtivo === 'dashboard'}" @click.prevent="showSection('dashboard')">
            <i class="bi bi-grid-1x2-fill me-2"></i>
            <span>Dashboard</span>
        </a>
        <a href="#" class="nav-link" :class="{'active': menuAtivo === 'extrato'}" @click.prevent="showSection('extrato')">
            <i class="bi bi-grid-1x2-fill me-2"></i>
            <span>Extrato</span>
        </a>
        <a href="#" class="nav-link" :class="{'active': menuAtivo === 'receitas'}" @click.prevent="showSection('receitas')">
            <i class="bi bi-arrow-up-circle-fill me-2"></i>
            <span>Receitas</span>
        </a>
        <a href="#" class="nav-link" :class="{'active': menuAtivo === 'despesas'}" @click.prevent="showSection('despesas')">
            <i class="bi bi-arrow-down-circle-fill me-2"></i>
            <span>Débitos</span>
        </a>
        <a href="#" class="nav-link" :class="{'active': menuAtivo === 'faturas'}" @click.prevent="showSection('faturas')">
            <i class="bi bi-credit-card-fill me-2"></i>
            <span>Faturas</span>
        </a>
        <a href="#" class="nav-link" :class="{'active': menuAtivo === 'investimentos'}" @click.prevent="showSection('investimentos')">
            <i class="bi bi-bar-chart-line-fill me-2"></i>
            <span>Invest.</span>
        </a>
        <a href="#" class="nav-link" :class="{'active': menuAtivo === 'dividas'}" @click.prevent="showSection('dividas')">
            <i class="bi bi-table me-2"></i>
            <span>Dívidas</span>
        </a>
        <a href="#" class="nav-link" :class="{'active': menuAtivo === 'controles'}" @click.prevent="showSection('controles')">
            <i class="bi bi-calendar2-plus-fill me-2"></i>
            <span>Controles</span>
        </a>
    </nav>
</aside>
</template>

<script setup>
defineProps({
    menuAtivo: String
})

const emit = defineEmits(['navigate']);

function showSection(section) {
    emit('navigate', section);
}
</script>

<style>
.sidebar {
    z-index: 100;
    padding: 48px 0 0;
    box-shadow: inset -1px 0 0 var(--border-color);
    background-color: var(--sidebar-bg);
    width: 250px;
    height: 100vh;
}
.sidebar-header {
    margin-bottom: 2rem;
}
.sidebar-header .logo {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--primary-color);
    text-align: center;
    margin-bottom: 2rem;
}
.sidebar-nav {
    flex: 1;
    margin-top: 0;
}
.sidebar-nav .nav-link {
    font-weight: 500;
    color: var(--sidebar-text);
    padding: 0.8rem 1.5rem;
    margin: 0.3rem 1rem;
    border-radius: 8px;
    transition: all 0.3s ease;
}
.sidebar-nav .nav-link:hover {
    background-color: var(--sidebar-hover);
    color: var(--sidebar-active);
}
.sidebar-nav .nav-link.active {
    background-color: var(--sidebar-active);
    color: var(--sidebar-bg);
}
@media (max-width: 768px) {
    .sidebar {
        display: none;
    }
}
</style>
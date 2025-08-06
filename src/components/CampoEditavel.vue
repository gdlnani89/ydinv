<template>
  <div class="info-item">
    <span class="info-label">{{ label }}:</span>

    <div v-if="editando" class="info-value d-flex align-items-center">
      <input 
        class="form-control" 
        type="text" 
        v-model="valorEditado" 
        placeholder="0,00"
      />
      <button class="btn" @click="confirmarEdicao">
        <i class="bi bi-check-circle text-success"></i>
      </button>
      <button class="btn" @click="$emit('cancelar')">
        <i class="bi bi-x-circle text-danger"></i>
      </button>
    </div>

    <div v-else class="info-value d-flex flex-column justify-content-between">
      <div>
        <span class="info-value me-2">{{ formatBalanceWithPrivacy(valor) }}</span>
        <button class="btn btn-pd1" @click="$emit('editar')">
          <i
            v-if="nomeCampo === 'valorAtual'" 
            class="bi bi-arrow-clockwise"
          ></i>
          <i
            v-if="nomeCampo === 'valorInicial'" 
            class="bi bi-pencil"
          ></i>
        </button>
      </div>

      <div v-if="quantidade > 1" class="text-muted small">
        <span class="info-label">Total:</span>
        {{ formatBalanceWithPrivacy(valor * quantidade) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  label: String,
  valor: Number,
  editando: Boolean,
  quantidade: {
    type: Number,
    default: 1
  },
  nomeCampo: String
});

const emit = defineEmits(['editar', 'confirmar', 'cancelar']);

const valorEditado = ref(props.valor);

watch(() => props.valor, (novoValor) => {
  valorEditado.value = novoValor;
});

function confirmarEdicao() {
  emit('confirmar', parseFloat(valorEditado.value.toString().replace(',', '.')));
}


function formatBalanceWithPrivacy(valor) {
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}
</script>

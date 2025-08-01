<template>
  <div class="periodo d-flex flex-column align-items-center">
    <div class="d-flex align-items-center">
      <button class="btn btn-primary me-2" @click="mesAnterior">
        <i class="bi bi-chevron-left"></i>
      </button>
      <input 
        type="month" 
        v-model="periodoAtual" 
        class="form-control mx-2 text-center"
        style="width: auto; min-width: 120px;"
        @change="atualizarPeriodo"
      />
      <button class="btn btn-primary ms-2" @click="proximoMes">
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>
    <div class="d-flex align-items-center">
      <span class="periodo-texto">{{ periodoFormatado }}</span>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';

export default {
  name: 'Periodo',
  props: {
    modelValue: String
  },
  emits: ['update:modelValue', 'periodo-change'],
  setup(props, { emit }) {
    const periodoAtual = ref('');
    // Inicializa com o mês atual ou valor externo
    onMounted(() => {
      if (props.modelValue) {
        periodoAtual.value = props.modelValue;
      } else {
      const hoje = new Date();
      const ano = hoje.getFullYear();
      const mes = String(hoje.getMonth() + 1).padStart(2, '0');
      periodoAtual.value = `${ano}-${mes}`;
        emit('update:modelValue', periodoAtual.value);
        emit('periodo-change', periodoAtual.value);
      }
    });
    // Sincroniza com valor externo
    watch(() => props.modelValue, (novo) => {
      if (novo && novo !== periodoAtual.value) {
        periodoAtual.value = novo;
      }
    });
    // Formata o período para exibição (ex: "Julho 2025")
    const periodoFormatado = computed(() => {
      if (!periodoAtual.value) return '';
      const [ano, mes] = periodoAtual.value.split('-');
      const nomesMeses = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];
      return `${nomesMeses[parseInt(mes) - 1]} ${ano}`;
    });
    // Navega para o mês anterior
    const mesAnterior = () => {
      if (!periodoAtual.value) return;
      const [ano, mes] = periodoAtual.value.split('-');
      let novoAno = parseInt(ano);
      let novoMes = parseInt(mes) - 1;
      if (novoMes < 1) {
        novoMes = 12;
        novoAno--;
      }
      periodoAtual.value = `${novoAno}-${String(novoMes).padStart(2, '0')}`;
      emit('update:modelValue', periodoAtual.value);
      emit('periodo-change', periodoAtual.value);
    };
    // Navega para o próximo mês
    const proximoMes = () => {
      if (!periodoAtual.value) return;
      const [ano, mes] = periodoAtual.value.split('-');
      let novoAno = parseInt(ano);
      let novoMes = parseInt(mes) + 1;
      if (novoMes > 12) {
        novoMes = 1;
        novoAno++;
      }
      periodoAtual.value = `${novoAno}-${String(novoMes).padStart(2, '0')}`;
      emit('update:modelValue', periodoAtual.value);
      emit('periodo-change', periodoAtual.value);
    };
    // Atualiza quando o input muda
    const atualizarPeriodo = () => {
      emit('update:modelValue', periodoAtual.value);
      emit('periodo-change', periodoAtual.value);
    };
    return {
      periodoAtual,
      periodoFormatado,
      mesAnterior,
      proximoMes,
      atualizarPeriodo
    };
  }
}
</script>

<style scoped>
.periodo {
  margin-bottom: 1rem;
}

.periodo-texto {
  font-size: 1.1rem;
  font-weight: 500;
  color: #495057;
}

input[type="month"] {
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  background-color: var(--card-bg);
}

input[type="month"]:focus {
  border-color: #86b7fe;
  outline: 0;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}
</style>
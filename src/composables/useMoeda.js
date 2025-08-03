// composables/useMoeda.js
import { ref } from 'vue';

export function useMoeda() {
  const valorFormatado = ref('0,00');

  function formatarComoMoeda(e) {
    if (!e || !e.target) return;

    let valorApenasDigitos = e.target.value.replace(/\D/g, '');

    if (!valorApenasDigitos) {
      valorFormatado.value = '0,00';
      return;
    }

    const valorNumerico = Number(valorApenasDigitos) / 100;

    valorFormatado.value = valorNumerico.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return {
    valorFormatado,
    formatarComoMoeda
  };
}
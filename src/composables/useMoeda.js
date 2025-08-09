// composables/useMoeda.js
export function useMoeda() {

  function formatarComoMoeda(campo, e) {
    if (!e || !e.target) return;

    let valorApenasDigitos = e.target.value.replace(/\D/g, '');

    if (!valorApenasDigitos) {
      this[campo] = '0,00';
      return;
    }

    const valorNumerico = Number(valorApenasDigitos) / 100;

    this[campo] = valorNumerico.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return {
    formatarComoMoeda
  };
}
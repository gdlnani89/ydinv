import { formatCurrency, formatCurrencyValue, parseCurrencyValue } from '../utils/formatters.js';

export default {
  methods: {
    formatCurrency,
    formatCurrencyValue,
    parseCurrencyValue,
    
    // Função utilitária para converter valores de forma segura
    safeParseFloat(value) {
      if (!value) return 0;
      
      // Se o valor já é um número, retorna diretamente
      if (typeof value === 'number') {
        return value;
      }
      
      // Se é string, converte para número
      return parseFloat(value) || 0;
    }
  }
} 
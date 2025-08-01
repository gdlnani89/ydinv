/**
 * Formata um valor numérico para o formato de moeda brasileira (R$ 1.234,56)
 * @param {number|string} value - Valor a ser formatado
 * @param {boolean} showCurrency - Se deve mostrar o símbolo da moeda (R$)
 * @returns {string} Valor formatado
 */
export function formatCurrency(value, showCurrency = true) {
  if (value === null || value === undefined || value === '') {
    return showCurrency ? 'R$ 0,00' : '0,00';
  }

  // Converte para número
  const numericValue = parseFloat(value) || 0;
  
  // Formata o número para o padrão brasileiro
  const formatted = numericValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return showCurrency ? `R$ ${formatted}` : formatted;
}

/**
 * Formata um valor numérico para o formato de moeda brasileira sem símbolo
 * @param {number|string} value - Valor a ser formatado
 * @returns {string} Valor formatado sem R$
 */
export function formatCurrencyValue(value) {
  return formatCurrency(value, false);
}

/**
 * Converte uma string formatada de volta para número
 * @param {string} formattedValue - Valor formatado (ex: "1.234,56")
 * @returns {number} Valor numérico
 */
export function parseCurrencyValue(formattedValue) {
  if (!formattedValue) return 0;
  
  // Remove R$ e espaços, substitui vírgula por ponto
  const cleanValue = formattedValue
    .replace(/R\$\s*/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  
  return parseFloat(cleanValue) || 0;
} 

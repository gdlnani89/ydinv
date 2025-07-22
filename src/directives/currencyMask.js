export const currencyMask = {
  mounted(el, binding) {
    // Função para formatar o valor baseada no código fornecido pelo usuário
    const formatCurrency = (value) => {
      if (!value) return '';
      
      // Remove tudo que não é número
      let valorApenasDigitos = value.replace(/\D/g, '');
      
      if (!valorApenasDigitos) {
        return '0,00';
      }
      
      const valorNumerico = Number(valorApenasDigitos) / 100;
      
      return valorNumerico.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    };

    // Função para extrair apenas números do valor formatado
    const extractNumericValue = (formattedValue) => {
      return formattedValue.replace(/\D/g, '');
    };

    // Função para obter o valor como float
    const getFloatValue = (formattedValue) => {
      const numericValue = extractNumericValue(formattedValue);
      return numericValue ? parseFloat(numericValue) / 100 : 0;
    };

    // Armazena as funções no elemento para uso posterior
    el.formatCurrency = formatCurrency;
    el.extractNumericValue = extractNumericValue;
    el.getFloatValue = getFloatValue;

    // Função para lidar com input
    const handleInput = (event) => {
      const input = event.target;
      const cursorPosition = input.selectionStart;
      const oldValue = input.value;
      
      // Remove formatação atual para contar caracteres
      const oldNumeric = extractNumericValue(oldValue);
      
      // Formata o novo valor
      const formattedValue = formatCurrency(input.value);
      
      // Atualiza o valor do input
      input.value = formattedValue;
      
      // Calcula nova posição do cursor
      const newNumeric = extractNumericValue(formattedValue);
      let newCursorPosition = cursorPosition;
      
      // Ajusta a posição do cursor baseado na diferença de caracteres
      if (newNumeric.length > oldNumeric.length) {
        // Adicionou dígitos
        newCursorPosition += formattedValue.length - oldValue.length;
      } else if (newNumeric.length < oldNumeric.length) {
        // Removeu dígitos
        newCursorPosition -= oldValue.length - formattedValue.length;
      }
      
      // Mantém o cursor dentro dos limites
      newCursorPosition = Math.max(0, Math.min(newCursorPosition, formattedValue.length));
      
      // Restaura a posição do cursor
      setTimeout(() => {
        input.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
      
      // Emite evento customizado com o valor numérico
      const numericValue = getFloatValue(formattedValue);
      input.dispatchEvent(new CustomEvent('currency-change', {
        detail: {
          formattedValue,
          numericValue,
          rawValue: input.value
        }
      }));
    };

    // Função para lidar com focus
    const handleFocus = (event) => {
      const input = event.target;
      // Seleciona todo o texto quando foca
      input.select();
    };

    // Função para lidar com blur
    const handleBlur = (event) => {
      const input = event.target;
      const value = input.value;
      
      // Se o valor está vazio, limpa o campo
      if (!value || value === '0,00') {
        input.value = '';
      }
    };

    // Adiciona os event listeners
    el.addEventListener('input', handleInput);
    el.addEventListener('focus', handleFocus);
    el.addEventListener('blur', handleBlur);

    // Armazena os event listeners para remoção posterior
    el._currencyMaskHandlers = {
      input: handleInput,
      focus: handleFocus,
      blur: handleBlur
    };

    // Formata o valor inicial se existir
    if (el.value) {
      el.value = formatCurrency(el.value);
    }
  },

  updated(el, binding) {
    // Atualiza o valor quando a binding muda
    const input = el;
    if (binding.value !== undefined && binding.value !== null) {
      const formattedValue = el.formatCurrency(binding.value.toString());
      if (input.value !== formattedValue) {
        input.value = formattedValue;
      }
    }
  },

  unmounted(el) {
    // Remove os event listeners
    if (el._currencyMaskHandlers) {
      el.removeEventListener('input', el._currencyMaskHandlers.input);
      el.removeEventListener('focus', el._currencyMaskHandlers.focus);
      el.removeEventListener('blur', el._currencyMaskHandlers.blur);
    }
  }
}; 
import { ref } from 'vue';
import { formatCurrency } from '../utils/formatters.js';

export function useBalancePrivacy() {
  const isBalanceHidden = ref(false);
  
  // Carrega o estado do localStorage
  const loadPrivacyState = () => {
    const saved = localStorage.getItem('balancePrivacy');
    isBalanceHidden.value = saved === 'hidden';
  };
  
  // Salva o estado no localStorage
  const savePrivacyState = () => {
    localStorage.setItem('balancePrivacy', isBalanceHidden.value ? 'hidden' : 'visible');
  };
  
  // Alterna o estado de privacidade
  const toggleBalancePrivacy = () => {
    isBalanceHidden.value = !isBalanceHidden.value;
    savePrivacyState();
  };
  
  // Formata um valor para exibição com privacidade
  const formatBalanceWithPrivacy = (value, showCurrency = true) => {
    if (isBalanceHidden.value) {
      return showCurrency ? 'R$ •••••••' : '•••••••';
    }
    
    // Usa a função formatCurrency do utils
    return formatCurrency(value, showCurrency);
  };
  
  // Inicializa carregando o estado
  loadPrivacyState();
  
  return {
    isBalanceHidden,
    toggleBalancePrivacy,
    formatBalanceWithPrivacy
  };
} 
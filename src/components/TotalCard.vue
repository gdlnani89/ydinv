<template>
  <div class="total-card">
    <div class="card total-card-inner">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h6 class="card-title mb-1">{{ titulo }}</h6>
            <p class="card-text mb-0">
              {{ contador }} {{ itemLabel }}{{ contador !== 1 ? 's' : '' }}
              {{ periodo ? `em ${periodo}` : 'cadastrados' }}
            </p>
          </div>
          <div class="text-end">
            <h4 class="total-valor mb-0">{{ valorFormatado }}</h4>
            <small>{{ subtitulo }}</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useBalancePrivacy } from '../composables/useBalancePrivacy.js';

export default {
  setup() {
    const { formatBalanceWithPrivacy } = useBalancePrivacy();
    return {
      formatBalanceWithPrivacy
    };
  },
  props: {
    titulo: {
      type: String,
      required: true
    },
    valor: {
      type: [Number, String],
      required: true
    },
    contador: {
      type: Number,
      default: 0
    },
    itemLabel: {
      type: String,
      default: 'item'
    },
    periodo: {
      type: String,
      default: ''
    },
    subtitulo: {
      type: String,
      default: 'Valor total'
    },
    tipo: {
      type: String,
      default: 'receitas', // receitas, despesas, faturas, investimentos, dividas
      validator: value => ['receitas', 'despesas', 'faturas', 'investimentos', 'dividas'].includes(value)
    }
  },
  computed: {
    valorFormatado() {
      return this.formatBalanceWithPrivacy(this.valor);
    }
  }
}
</script>

<style scoped>
.total-card-inner {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%) !important;
  color: white !important;
  border: none !important;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
}

.total-card-inner .card-body {
  padding: 0.75rem;
}

.total-card-inner .card-title {
  color: white !important;
  font-weight: 600;
  font-size: 0.85rem;
  margin-bottom: 0.2rem;
}

.total-card-inner .card-text {
  color: rgba(255, 255, 255, 0.8) !important;
  font-size: 0.75rem;
}

.total-card-inner .total-valor {
  color: white !important;
  font-weight: 700;
  font-size: 1.4rem;
}

.total-card-inner small {
  color: rgba(255, 255, 255, 0.7) !important;
  font-size: 0.7rem;
}
</style> 
<template>
  <div class="modal-backdrop" @click="$emit('fechar')">
    <div class="modal-dialog" @click.stop>
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="bi bi-plus-circle me-2"></i>
            {{ lancamento ? 'Editar Lançamento' : 'Novo Lançamento' }}
          </h5>
          <button type="button" class="btn-close" @click="$emit('fechar')"></button>
        </div>
        <form @submit.prevent="salvar">
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label fw-semibold">
                <i class="bi bi-list-ul me-1"></i>Tipo de Controle
              </label>
              <select class="form-select form-select-lg" v-model="form.tipoControleId" disabled>
                <option v-for="t in tiposControle" :key="t.id" :value="Number(t.id)">{{ t.nome }}</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold">
                <i class="bi bi-calendar me-1"></i>Data *
              </label>
              <input type="date" class="form-control form-control-lg" v-model="form.data" required>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold">
                <i class="bi bi-currency-dollar me-1"></i>Valor *
              </label>
              <div class="input-group">
                <span class="input-group-text">R$</span>
                <input type="text" class="form-control form-control-lg" v-model="form.valor" @input="mascararValor" required>
              </div>
            </div>
            <div class="mb-3 d-flex align-items-center gap-3">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="parceladoCheck" v-model="form.parcelado">
                <label class="form-check-label" for="parceladoCheck">Parcelado?</label>
              </div>
              <div v-if="form.parcelado" class="flex-grow-1">
                <label class="form-label mb-0 ms-2">Nº de parcelas:</label>
                <input type="number" min="2" max="60" class="form-control d-inline-block w-auto ms-2" v-model.number="form.parcelas">
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold">
                <i class="bi bi-chat-text me-1"></i>Descrição
              </label>
              <input type="text" class="form-control" v-model="form.descricao" maxlength="60" placeholder="Ex: Vianda do dia">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" @click="$emit('fechar')">
              <i class="bi bi-x-lg me-1"></i>Cancelar
            </button>
            <button type="submit" class="btn btn-primary">
              <i class="bi bi-check-lg me-1"></i>{{ lancamento ? 'Atualizar' : 'Salvar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    controle: { type: Object, default: null },
    tiposControle: { type: Array, default: () => [] },
    lancamento: { type: Object, default: null },
  },
  data() {
    return {
      form: {
        tipoControleId: this.controle ? Number(this.controle.id) : '',
        data: this.hoje(),
        valor: (this.controle && !isNaN(Number(this.controle.valorPadrao)) && this.controle.valorPadrao !== '')
          ? Number(this.controle.valorPadrao).toFixed(2).replace('.', ',')
          : '',
        descricao: '',
        parcelado: false,
        parcelas: 1,
      }
    };
  },
  watch: {
    controle: {
      immediate: true,
      handler(val) {
        if (val && !this.lancamento) {
          this.form.tipoControleId = val.id;
          this.form.valor = (!isNaN(Number(val.valorPadrao)) && val.valorPadrao !== '')
            ? Number(val.valorPadrao).toFixed(2).replace('.', ',')
            : '';
        }
      }
    },
    lancamento: {
      immediate: true,
      handler(val) {
        if (val) {
          this.form = {
            tipoControleId: val.idControle,
            data: val.data,
            valor: val.valor,
            descricao: val.descricao
          };
        }
      }
    }
  },
  methods: {
    salvar() {
      const valorTotal = this.parseValor(this.form.valor);
      const totalParcelas = this.form.parcelado ? Number(this.form.parcelas) : 1;
      const valorParcela = valorTotal / totalParcelas;
      const lancamentos = [];
      
      for (let i = 1; i <= totalParcelas; i++) {
        let dataParcela = this.form.data;
        
        // Se for parcelado, incrementa a data mês a mês
        if (this.form.parcelado && i > 1) {
          const data = new Date(this.form.data);
          data.setMonth(data.getMonth() + (i - 1));
          dataParcela = data.toISOString().split('T')[0];
        }
        
        lancamentos.push({
          tipoControleId: this.form.tipoControleId,
          data: dataParcela,
          valor: valorParcela,
          descricao: this.form.descricao,
          parcela: totalParcelas > 1 ? `${i}/${totalParcelas}` : null,
          pago: false
        });
      }
      this.$emit('salvar', lancamentos);
    },
    mascararValor(e) {
      let v = e.target.value.replace(/\D/g, '');
      v = (parseInt(v, 10) / 100).toFixed(2) + '';
      v = v.replace('.', ',');
      e.target.value = v;
      this.form.valor = v;
    },
    parseValor(valor) {
      if (!valor) return 0;
      return parseFloat(valor.replace('.', '').replace(',', '.'));
    },
    hoje() {
      const d = new Date();
      return d.toISOString().slice(0, 10);
    },
    onTipoChange() {
      const tipo = this.tiposControle.find(t => Number(t.id) === Number(this.form.tipoControleId));
      if (tipo && tipo.valorPadrao) {
        this.form.valor = Number(tipo.valorPadrao).toFixed(2).replace('.', ',');
      } else {
        this.form.valor = '';
      }
    }
  }
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
.modal-dialog {
  background: white;
  border-radius: 16px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  animation: slideIn 0.3s ease-out;
  max-height: 90vh;
  overflow: hidden;
}
.modal-content {
  border: none;
  border-radius: 16px;
}
.modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px 16px 0 0;
  padding: 1.5rem;
  border-bottom: none;
}
.modal-title {
  font-weight: 600;
  margin: 0;
  font-size: 1.15rem;
}
.btn-close {
  filter: invert(1);
  opacity: 0.8;
}
.btn-close:hover {
  opacity: 1;
}
.modal-body {
  padding: 2rem;
}
.form-label {
  color: #495057;
  margin-bottom: 0.5rem;
}
.form-control {
  border: 2px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.2s ease;
}
.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}
.form-control-lg {
  padding: 0.75rem 1rem;
  font-size: 1rem;
}
.input-group-text {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-right: none;
  color: #6c757d;
  font-weight: 500;
}
.input-group .form-control {
  border-left: none;
}
.modal-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
  border-radius: 0 0 16px 16px;
}
.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}
.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}
.btn-outline-secondary {
  border: 2px solid #6c757d;
  color: #6c757d;
}
.btn-outline-secondary:hover {
  background: #6c757d;
  border-color: #6c757d;
}
@keyframes slideIn {
  from { 
    transform: translateY(-20px) scale(0.95); 
    opacity: 0; 
  }
  to { 
    transform: translateY(0) scale(1); 
    opacity: 1; 
  }
}
@media (max-width: 576px) {
  .modal-dialog {
    margin: 0.5rem;
    max-width: none;
  }
  .modal-body {
    padding: 1.5rem;
  }
  .modal-footer {
    padding: 1rem 1.5rem;
  }
}
</style> 
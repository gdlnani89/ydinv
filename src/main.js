import { createApp } from 'vue'
import './style.css'
import './styles/themes.css'
import App from './App.vue'
import currencyMixin from './mixins/currencyMixin.js'
import { setupPWAEvents } from './utils/pwaUtils.js'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Configuração PWA
setupPWAEvents()

const app = createApp(App)
app.mixin(currencyMixin)
app.mount('#app')

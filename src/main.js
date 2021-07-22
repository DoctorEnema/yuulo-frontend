import Vue from 'vue'
import app from './app.vue'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/index.css';
import './registerServiceWorker'
import router from './router'
import store from './store'
import './styles/styles.scss'

Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(app)
}).$mount('#app')

import Vue from 'vue'
import app from './app.vue'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/index.css';
import './registerServiceWorker'
import router from './router'
import store from './store'
import './styles/styles.scss'
import VueDatePicker from '@mathieustan/vue-datepicker';
import '@mathieustan/vue-datepicker/dist/vue-datepicker.min.css';
import vClickOutside from 'v-click-outside'
 
Vue.use(vClickOutside)
Vue.use(VueDatePicker);

Vue.use(VueDatePicker, {
  lang: 'en'
});

Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(app)
}).$mount('#app')

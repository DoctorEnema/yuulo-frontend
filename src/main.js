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
import GAuth from 'vue-google-oauth2'

const gauthOption = {
  clientId: '77664739327-oa9va2n4jgbeho5h4gvl2i0pp45hqhnu.apps.googleusercontent.com',
  scope: 'profile email',
  prompt: 'select_account'
}
Vue.use(GAuth, gauthOption)
Vue.use(vClickOutside)
Vue.use(VueDatePicker);
Vue.use(VueDatePicker, {
  lang: 'en'
});
Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

Notification.requestPermission(function(status) {
  console.log('Notification permission status:', status);
});


// function displayNotification() {
//   if (Notification.permission == 'granted') {
//     navigator.serviceWorker.getRegistration().then(function(reg) {
//       reg.showNotification('Hello world!');
//     });
//   }
// }

new Vue({
  router,
  store,
  render: h => h(app)
}).$mount('#app')

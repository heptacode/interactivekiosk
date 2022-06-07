import AppButton from '@/components/AppButton.vue';
import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

import '@iconify/iconify';
import 'vue-material/dist/theme/default.css';
import 'vue-material/dist/vue-material.min.css';

import {
  MdButton,
  MdCard,
  MdContent,
  MdField,
  MdProgress,
  MdRipple,
  MdTabs,
} from 'vue-material/dist/components';

Vue.config.productionTip = false;

Vue.component('AppButton', AppButton);

Vue.use(MdButton);
Vue.use(MdContent);
Vue.use(MdField);
Vue.use(MdProgress);
Vue.use(MdTabs);
Vue.use(MdRipple);
Vue.use(MdCard);

try {
  if ('Notification' in window) {
    if (Notification.permission == 'granted') {
      console.log('Notification granted');
    } else if (Notification.permission == 'denied') {
      console.log('Notification denied');
    } else {
      Notification.requestPermission(status => {
        console.log('Notification.requestPermission status : ' + status);
      });
    }
  }
} catch (err) {
  console.log('No Notification');
}

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');

import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

import "@iconify/iconify";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default.css";

import { MdButton, MdContent, MdTabs } from "vue-material/dist/components";

Vue.config.productionTip = false;

Vue.use(MdButton);
Vue.use(MdContent);
Vue.use(MdTabs);

new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount("#app");

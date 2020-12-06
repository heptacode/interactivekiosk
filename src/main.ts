import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import AppButton from "@/components/AppButton.vue";

import "@iconify/iconify";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default.css";

import { MdButton, MdContent, MdField, MdTabs, MdRipple, MdCard } from "vue-material/dist/components";

Vue.config.productionTip = false;

Vue.component("AppButton", AppButton);

Vue.use(MdButton);
Vue.use(MdContent);
Vue.use(MdField);
Vue.use(MdTabs);
Vue.use(MdRipple);
Vue.use(MdCard);

new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount("#app");

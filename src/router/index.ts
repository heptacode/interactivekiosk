import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "@/views/Home.vue";
import Order from "@/views/Order.vue";
import Admin from "@/views/Admin.vue";
import VoiceOrder from "@/views/VoiceOrder.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
	{
		path: "/",
		name: "홈",
		component: Home,
	},
	{
		path: "/order",
		name: "주문하기",
		component: Order,
	},
	{
		path: "/voiceorder",
		name: "음성으로 주문하기",
		component: VoiceOrder,
	},
	{
		path: "/admin",
		name: "관리자",
		component: Admin,
	},
];

const router = new VueRouter({
	mode: process.env.IS_ELECTRON ? "hash" : "history",
	base: process.env.BASE_URL,
	routes,
});

export default router;

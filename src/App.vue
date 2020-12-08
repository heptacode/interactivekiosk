<template>
	<div id="app">
		<header>
			<div class="pwa">
				<app-button v-if="1 /*deferredPrompt*/" circle color="default" @click="showPWA">
					<i class="iconify" data-icon="mdi:download"></i>
				</app-button>
			</div>
			<div class="title">
				<i data-icon="mdi-account-voice" class="iconify" />
				Interactive Kiosk
			</div>
			<div class="admin" @dblclick="$router.replace('/admin')"></div>
		</header>
		<div class="path-list">
			<router-link to="/" class="path">
				<i class="iconify path" data-icon="mdi-home" @click="$router.replace('/')"></i>
			</router-link>
			<span class="path">{{ $route.name }}</span>
		</div>
		<div class="content">
			<router-view />
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { Action, Mutation } from "vuex-class";
import AudioModule from "./store/modules/AudioModule";

@Component({})
export default class App extends Vue {
	@Action("bindStock") bindStock!: Function;
	@Mutation("stopAudio", { namespace: "AudioModule" }) stopAudio!: Function;
	@Mutation("stopHelloLoop") stopHelloLoop!: Function;

	@Watch("$route")
	onRouteChange() {
		this.stopAudio();
		this.stopHelloLoop();
	}

	deferredPrompt: any = false;

	async mounted() {
		await this.bindStock();
		window.addEventListener("beforeinstallprompt", (e: any) => {
			e.preventDefault();
			this.deferredPrompt = e;
			console.log("installed");
			e.prompt();
		});
	}

	showPWA() {
		this.deferredPrompt.prompt();
	}

	get isMac() {
		return process.platform === "darwin";
	}
}
</script>

<style lang="scss">
* {
	margin: 0;
	padding: 0;

	box-sizing: border-box;
}

button {
	border: none;
}
::-webkit-scrollbar {
	width: 5px;
	height: 5px;
}
::-webkit-scrollbar-thumb:window-inactive,
::-webkit-scrollbar-thumb {
	width: 5px;
	height: 5px;
	background-color: #cccccc;
}
::-webkit-scrollbar-track {
	width: 5px;
	height: 5px;
	background-color: #dddddd;
}

html {
	-webkit-user-select: none;
	user-select: none;
	word-break: keep-all;

	background-color: #eeeeee;
}
#app {
	display: flex;
	flex-direction: column;
	width: 100vw;
	height: 100vh;
	overflow: hidden;

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;

		background-color: #1c1b29;

		font-size: 32px;
		text-align: center;
		color: white;

		-webkit-user-select: none;
		-webkit-app-region: drag;

		.pwa {
			display: flex;
			justify-content: center;
			align-items: center;

			width: 60px;
			height: 60px;

			.app-button {
				font-size: 20px;

				z-index: 10000;
			}
		}

		.title {
			font-weight: bold;

			.iconify {
				margin-right: 10px;
			}
		}

		.admin {
			width: 60px;
			height: 60px;

			cursor: move;
		}
	}

	.content {
		flex: 1;

		overflow-y: hidden;
	}

	.path-list {
		display: flex;
		align-items: center;

		padding: 4px 24px;

		background-color: rgba(#1c1b29, 0.8) !important;

		color: rgba(#fff, 0.65);
		font-size: 16px;

		.iconify {
		}

		.path {
			display: flex;
			align-items: center;
			color: rgba(#fff, 0.65);

			cursor: pointer;

			&:not(:first-child)::before {
				content: "＞";

				margin: 0 8px;

				font-size: 12px;
			}

			&:hover {
				color: #fff;
			}
		}
	}
}
</style>

<template>
	<div id="app">
		<header v-if="true || isAdmin">
			<router-link to="/" class="btn-home">
				<i class="iconify" data-icon="mdi:home" />
			</router-link>
			<app-button v-if="deferredPrompt" circle color="default" @click="showPWA">
				<i class="iconify" data-icon="mdi:download"></i>
			</app-button>
			<button v-if="!isMac" class="btn-close" @click="closeWindow">
				<i class="iconify" data-icon="mdi:close" />
			</button>
		</header>
		<div id="content">
			<router-view />
		</div>
		<button
			id="admin"
			draggable
			ref="adminButton"
			@dragstart="goAdmin"
			@touchmove="goAdmin"
		/>
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
	closeWindow() {
		window.close();
	}
	goAdmin() {
		this.$router.push("/admin");
	}

	get isMac() {
		return process.platform === "darwin";
	}
	get isAdmin() {
		return this.$route.name === "관리자";
	}
}
</script>

<style lang="scss">
// Reset default style
*,
::before,
::after {
	margin: 0;
	padding: 0;

	border: none;
	background: none;

	box-sizing: border-box;

	color: inherit;
	font: inherit;
	text-decoration: inherit;
}

// Reset root style
html {
	height: 100%;

	overflow: hidden auto;

	-webkit-user-select: none;
	user-select: none;
	word-break: keep-all;
}
body {
	height: 100%;
}

// Layout style
#app {
	display: flex;
	flex-direction: column;

	height: 100%;

	header {
		display: flex;
		justify-content: flex-end;
		align-items: center;

		position: sticky;
		z-index: 1024;
		top: 0;

		flex: 0 0 32px;
		padding: 4px;

		background-color: #111;

		font-size: 24px;

		-webkit-app-region: drag;

		[class^="btn"] {
			display: flex;
			color: white;

			cursor: pointer;

			-webkit-app-region: no-drag;
		}
	}
}
#content {
	flex: 1 1 0;
}

// Control buttons
#admin {
	position: absolute;
	top: 0;
	right: 0;

	width: 32px;
	height: 32px;
}
</style>

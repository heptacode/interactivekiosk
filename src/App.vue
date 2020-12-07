<template>
	<div id="app">
		<div class="topbar">
			<div class="actions">
				<div class="admin" @dblclick="$router.replace('/admin')"></div>
				<button v-if="isMac" class="close" @mousedown="closeApp"></button>
			</div>
			<div class="menu">
				<i data-icon="mdi-account-voice" class="iconify" />
				Interactive Kiosk
			</div>
		</div>
		<header class="path-list">
			<router-link to="/" class="path">
				<i class="iconify path" data-icon="mdi-home" @click="$router.replace('/')"></i>
			</router-link>
			<span class="path">{{ $route.name }}</span>
		</header>
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

	async mounted() {
		await this.bindStock();
	}

	closeApp() {
		window.close();
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
	.topbar {
		position: relative;

		display: flex;
		flex-direction: column;

		-webkit-user-select: none;
		-webkit-app-region: drag;

		color: white;
		background-color: #1c1b29;

		.actions {
			position: absolute;
			width: 100%;

			top: 0;
			display: flex;
			justify-content: flex-end;

			.admin {
				width: 60px;
				height: 60px;
				cursor: move;
			}

			.close {
				-webkit-app-region: no-drag;

				cursor: pointer;
				background-color: #aa3333;

				border-radius: 5px 0 5px 5px;

				width: 20px;
				height: 20px;
				z-index: 10000;
			}

			z-index: 1000;
		}
		.menu {
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 20px;

			font-size: 32px;
			font-weight: bold;
			text-align: center;

			.iconify {
				margin-right: 10px;
			}
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

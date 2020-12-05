<template>
	<div id="app">
		<div class="topbar">
			<div class="actions">
				<button class="close" @click="closeApp" v-if="!isMac"></button>
			</div>
			<div class="menu">
				<i data-icon="mdi-account-voice" class="iconify" />
				Interactive Kiosk
			</div>
		</div>
		<header class="path-list">
			<router-link to="/" class="path">
				<i class="iconify path" data-icon="mdi-home" @click="$router.push('/')"></i>
			</router-link>
			<span class="path">{{ getRouterName }}</span>
		</header>
		<div class="content">
			<router-view />
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class App extends Vue {
	closeApp() {
		window.close();
	}

	// 맥인지 확인
	get isMac() {
		console.log(process.platform);
		return process.platform === "darwin";
	}

	// 라우터 이름을 감지해서 변경
	get getRouterName() {
		let routerNameToKoreanName: { [key in string]: string } = {
			Order: "주문하기",
		};
		return routerNameToKoreanName[this.$route.name as string] || this.$route.name;
	}
}
</script>

<style lang="scss">
* {
	margin: 0;
	padding: 0;

	box-sizing: border-box;
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

button {
	border: none;
	outline: none;
	cursor: pointer;
	-webkit-user-select: none;
}

html {
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
			.close {
				cursor: pointer;
				background-color: #aa3333;

				border-radius: 5px 0 5px 5px;

				width: 20px;
				height: 20px;
			}
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

		overflow-y: scroll;
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

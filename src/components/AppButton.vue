<template>
	<md-button class="md-raised md-primary app-button" v-bind="$props" v-on="$listeners">
		<slot></slot>
	</md-button>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";

@Component
export default class AppButton extends Vue {}
</script>

<style lang="scss" scoped>
.app-button {
	// border: none;
	// outline: none;
	// cursor: pointer;
	// -webkit-user-select: none;

	// font-size: 1em;
	// padding: 10px;
	margin: 0;

	// border-radius: 50px;
	// background: linear-gradient(145deg, #e6e6e6, #ffffff);
	// box-shadow: 6px 6px 12px #c2c2c2, -6px -6px 12px #ffffff;

	// color: #666666;

	&.round {
		border-radius: 20px;
	}
	// &:active {
	// 	background: #eeeeee;
	// 	box-shadow: inset 6px 6px 12px #c2c2c2, inset -6px -6px 12px #ffffff;
	// }
	// &:disabled {
	// 	cursor: not-allowed;
	// 	background: #dddddd;
	// 	box-shadow: 2px 2px 12px #c2c2c2, -2px -2px 12px #ffffff;
	// }
}
</style>

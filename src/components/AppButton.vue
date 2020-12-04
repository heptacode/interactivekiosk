<template>
	<button class="app-button" v-bind="$props" v-on="$listeners">
		<slot></slot>
	</button>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";

@Component
export default class AppButton extends Vue {}
</script>

<style lang="scss" scoped>
.app-button {
	display: flex;
	justify-content: center;
	align-items: center;

	padding: 8px 12px;

	border: none;
	border-radius: 12px;

	background: none;
	background-color: #f6cb4c;

	font-size: 16px;

	cursor: pointer;

	transition: background 0.1s;

	&:hover {
		background-color: rgba(#f6cb4c, 0.75);
	}

	&:disabled {
		opacity: 0.8;

		cursor: not-allowed;
	}
}
</style>

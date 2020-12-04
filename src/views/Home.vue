<template>
	<div class="home">
		<AppButton @click="testClick">테스트</AppButton>
		<STT :isRecord="isRecord" :callback="callback"></STT>
	</div>
</template>

<script lang="ts">
import AppButton from "@/components/AppButton.vue";
import STT from "@/components/util/STT.vue";
import { Component, Vue } from "vue-property-decorator";

@Component({
	components: {
		AppButton,
		STT,
	},
})
export default class Home extends Vue {
	isRecord: boolean = false;
	async testClick() {
		// TTS 로 테스트라고 말함
		await this.$store.dispatch("TTS", "테스트");

		// 녹음시작
		this.isRecord = true;
		setTimeout(() => {
			// 녹음 종료
			this.isRecord = false;
		}, 3000);
	}
	callback(text: string) {
		// 녹음 완료 시 props로 받은 callback 호출
		console.log(text);
	}
}
</script>

<style lang="scss" scoped></style>

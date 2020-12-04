<template>
	<div class="stt"></div>
</template>

<script lang="ts">
import { Component, Model, Prop, Vue, Watch } from "vue-property-decorator";

declare class MediaRecorder {
	constructor(stream: any);
	start(): void;
	stop(): void;
	addEventListener(str: string, callback: any): void;
}

@Component
export default class STT extends Vue {
	@Model("change", { type: Boolean }) readonly isRecord!: boolean;
	@Prop({ type: Function }) callback!: (text: string) => void;

	blob: Blob | null = null;
	mediaRecorder!: MediaRecorder;
	isStarted: boolean = false;

	@Watch("isRecord")
	changeIsRecord(value: boolean) {
		if (value) this.start();
		else this.stop();
	}

	async created() {
		let stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		this.mediaRecorder = new MediaRecorder(stream);
		this.mediaRecorder.addEventListener("dataavailable", (ev: any) => {
			this.blob = new Blob([ev.data], { type: "application/octet-stream" });
			this.transform();
		});
	}

	start() {
		if (!this.isStarted) {
			console.log("녹음 시작");
			this.mediaRecorder.start();
		}
		this.isStarted = true;
	}

	stop() {
		if (this.isStarted) {
			console.log("녹음 종료");
			this.mediaRecorder.stop();
		}
		this.isStarted = false;
	}

	async transform() {
		console.log("텍스트 변환 시작");
		try {
			let text = await this.$store.dispatch("STT", this.blob);
			this.callback && this.callback(text);
			this.$emit("record", text);
			console.log(`변환 데이터: ${text}`);
		} catch (err) {
			this.callback && this.callback("");
			this.$emit("record", "");
			console.log(`변환 데이터: 실패`);
			console.error(err);
		}
	}
}
</script>
<style lang="scss" scoped>
.stt {
	display: none;
}
</style>

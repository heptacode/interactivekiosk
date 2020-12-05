<template>
	<div class="voice-order">
		<STT v-model="isRecord" @record="parseText"></STT>
		{{ buyStockList }}
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import { StockItem } from "@/schema";
import { Action, State } from "vuex-class";
import STT from "@/components/util/STT.vue";

const koreanNumber = require("@/lib/koreanNumber.json");

@Component({
	components: {
		STT,
	},
})
export default class VoiceOrder extends Vue {
	@State("stockList", { namespace: "StockListModule" }) stockList!: StockItem[];

	@Action("playAudio", { namespace: "AudioModule" }) playAudio!: Function;
	@Action("TTS") TTS!: Function;

	isRecord: boolean = false;
	isSpeakable: boolean = false;
	isEnd: boolean = false;

	buyStockList: StockItem[] = []; // 현 주문 상품

	async mounted() {
		window.addEventListener("keydown", this.activatePTT);
		window.addEventListener("keyup", this.deactivatePTT);

		await this.playAudio({ isLocal: true, url: "voiceorder/earphone_connected" });
		this.isSpeakable = true;
	}
	activatePTT(event: KeyboardEvent) {
		if (!this.isEnd) {
			if (event.code !== "Space" || this.isRecord || !this.isSpeakable) return;
			this.isRecord = true;
			this.isSpeakable = false;
			this.playAudio({ isLocal: true, url: "voiceorder/ptt_activate" });
		}
	}

	deactivatePTT(event: KeyboardEvent) {
		if (!this.isEnd) {
			if (event.code !== "Space" || !this.isRecord) return;
			this.isRecord = false;
			this.playAudio({ isLocal: true, url: "voiceorder/ptt_deactivate" });
		}
	}

	async parseText(text: string) {
		let unavailableItems: StockItem[] = []; // 주문 불가능한 상품

		if (text == "완료") {
			return this.submit();
		}

		try {
			let reg = new RegExp(
				`(${this.stockList
					.map((item) => item.alias)
					.flat()
					.join("|")}).*?(?:([1-9]+[0-9]*)|(열|스물|서른|마흔|쉰|예순|일흔|여든|아흔)(하나|둘|셋|다섯|여섯|일곱|여덟|아홉)?|(스무)|(한|하나|두|둘|세|셋|네|넷|다섯|여섯|일곱|여덟|아홉))`
			);
			console.log(reg);

			// FIXME: 여러개 상품 지원

			let match =
				text
					.trim()
					.match(reg)
					?.filter((i) => i) || [];

			let menuAlias = String(match![1]);

			// 인덱스 가져오기
			let stockItem: StockItem | undefined = this.stockList.find((item) => item.alias!.indexOf(menuAlias) != -1);
			if (!stockItem) throw "메뉴가 존재하지 않습니다.";

			// 갯수 가져오기
			let quantity = 0;
			let matchCount = String(match[2]);
			if (matchCount in koreanNumber) quantity = koreanNumber[matchCount];
			else quantity = 1;

			console.log(`인식 - ${menuAlias}, ${quantity}`);

			let prevStockItem = this.buyStockList.find((s) => s.name == stockItem?.name);
			if (prevStockItem) {
				if (stockItem!.quantity > prevStockItem.quantity) prevStockItem.quantity++;
				else unavailableItems.push(stockItem);
			} else this.buyStockList.push({ ...stockItem!, quantity: 1 });

			let clearStr = `장바구니에 추가된 메뉴는 ${this.buyStockList.map((item) => item.name).join(",") || "없"}${
				unavailableItems.length ? `이며, 주문이 불가능한 메뉴는 ${unavailableItems.map((s) => s.name).join(",")}입니다.` : "입니다."
			}`;

			console.log(clearStr);
			console.log(this.buyStockList);

			await this.TTS(clearStr);
		} catch (err) {
			console.error(err);
			await this.playAudio({ isLocal: true, url: "voiceorder/error" });
		}
		this.isSpeakable = true;
	}
	async submit() {
		this.isRecord = false;
		this.isSpeakable = false;
		this.isEnd = true;

		// TODO: 결제 (buyStockList)

		await this.playAudio({ isLocal: true, url: "voiceorder/checkout_complete" });
	}
}
</script>

<style lang="scss" scoped></style>

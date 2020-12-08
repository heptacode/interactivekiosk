<template>
	<div class="voiceorder">
		<div class="dialog">
			<div class="speech">
				<app-button circle color="default">
					<i class="iconify" data-icon="mdi:volume-high"></i>
				</app-button>
				{{ script }}
			</div>
			<div v-if="userText" class="userText">
				<app-button circle color="default">
					<i class="iconify" data-icon="mdi:microphone"></i>
				</app-button>
				{{ userText }}
			</div>
		</div>

		<div class="indicator" :class="{ speakable: isSpeakable, recording: isRecording }">
			<span v-if="isSpeakable || isRecording">
				<span> <i class="iconify" data-icon="mdi:microphone"></i></span>
			</span>
			<span v-else>
				<span> <i class="iconify" data-icon="mdi:microphone-off"></i></span>
			</span>
		</div>

		<div class="shoppingCart-container">
			<transition name="fade">
				<md-card class="shoppingCart" v-if="shoppingCart.length">
					<div class="shoppingCart-heading">
						<h1>장바구니</h1>
					</div>

					<div v-for="(item, idx) in shoppingCart" :key="idx" class="shoppingCart-item">
						<img :src="item.image" alt="" />
						<h2>{{ item.name }}</h2>
						<h3>&times;{{ item.quantity }}</h3>

						<h3 class="price">{{ numberFormat(item.price * item.quantity) }}원</h3>
					</div>

					<h2 class="total">합계 | {{ getTotalPrice }}원</h2>
				</md-card>
			</transition>
		</div>

		<transition name="fade">
			<div v-if="isCheckoutVisible" class="checkout-container">
				<md-card class="checkout">
					<div class="checkout-heading">
						<h1>결제하기</h1>
						<app-button round color="accent" @click="isCheckoutVisible = false">
							<i class="iconify" data-icon="mdi:close"></i>
							취소하기
						</app-button>
					</div>
					<img src="/assets/images/credit_card.svg" alt="Credit Card" />

					<h2 class="total">{{ getTotalPrice }}원을 결제하려면 카드를 삽입해주세요.</h2>
				</md-card>
			</div>
		</transition>

		<STT v-model="isRecording" :callback="parseText" />
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import { StockItem } from "@/schema";
import { Action, State } from "vuex-class";
import STT from "@/components/util/STT.vue";

import numberFormat from "@/utils/numberFormat";

const script = require("@/lib/script.json");
const koreanNumber = require("@/lib/koreanNumber.json");

@Component({
	components: {
		STT,
	},
})
export default class VoiceOrder extends Vue {
	@State("stockList") stockList!: StockItem[];
	@State("script") script!: string;
	@State("userText") userText!: string;

	@Action("playAudio", { namespace: "AudioModule" }) playAudio!: Function;
	@Action("playItems") playItems!: Function;
	@Action("TTS") TTS!: Function;

	isRecording: boolean = false;
	isSpeakable: boolean = false;
	isOrderProcess: boolean = false;

	isCheckoutVisible: boolean = false;

	shoppingCart: StockItem[] = []; // 현 주문 상품

	async mounted() {
		window.addEventListener("keydown", this.activatePTT);
		window.addEventListener("keyup", this.deactivatePTT);

		this.$store.state.script = script.earphone_connected;
		await this.playAudio({ isLocal: true, data: "voiceorder/earphone_connected" });
		// await this.playItems();
		this.isOrderProcess = true;
		this.orderProcess();

		// setTimeout(() => {
		// 	this.shoppingCart.push(
		// 		{
		// 			name: "망고",
		// 			price: 4000,
		// 			quantity: 2,
		// 			image: "https://firebasestorage.googleapis.com/v0/b/interactive-kiosk.appspot.com/o/products%2Fmango.jpg?alt=media&token=657b4a4a-0be6-4a45-8104-8659daf86edc",
		// 		},
		// 		{
		// 			name: "자몽",
		// 			price: 3000,
		// 			quantity: 5,
		// 			image: "https://firebasestorage.googleapis.com/v0/b/interactive-kiosk.appspot.com/o/products%2Fgrapefruit.jpg?alt=media&token=8f451da3-be70-4100-b94b-7f8514197087",
		// 		}
		// 	);
		// }, 500);
	}

	numberFormat(number: number) {
		return numberFormat(number);
	}

	get getTotalPrice(): string {
		let total = 0;
		this.shoppingCart.forEach((i) => {
			total += i.price * i.quantity;
		});
		return numberFormat(total);
	}

	activatePTT(event: KeyboardEvent) {
		if (event.code !== "Space" || this.isRecording || !this.isSpeakable || !this.isOrderProcess) return;
		this.isRecording = true;
		this.isSpeakable = false;
		this.playAudio({ isLocal: true, data: "voiceorder/ptt_activate" });
	}

	deactivatePTT(event: KeyboardEvent) {
		if (event.code !== "Space" || !this.isRecording || !this.isOrderProcess) return;
		setTimeout(() => {
			this.isRecording = this.isSpeakable = false;
		}, 1000);
		this.playAudio({ isLocal: true, data: "voiceorder/ptt_deactivate" });
	}

	async orderProcess() {
		if (this.isOrderProcess) {
			if (!this.shoppingCart.length) {
				this.$store.state.script = script.ask;
				await this.playAudio({ isLocal: true, data: "voiceorder/ask" });
			} else {
				this.$store.state.script = script.ask_another;
				await this.playAudio({ isLocal: true, data: "voiceorder/ask_another" });
			}
			this.isSpeakable = true;
		}
	}

	async parseText(text: string) {
		let unavailableItems: StockItem[] = []; // 주문 불가능한 상품

		this.isSpeakable = false;

		if (text == "완료" || text == "종료") return this.checkout();

		try {
			let split = text.split(new RegExp("(,| )")).filter((data) => data.trim() && data.trim() != ",");
			console.log(split);
			for (let i = 0; i < split.length; i++) {
				let word = split[i];
				let nextWord = split[i + 1];

				let wordMatch = word?.match(
					new RegExp(
						`(${this.stockList
							.map((item) => [item.name, item.alias])
							.flat()
							.join("|")})`
					)
				)?.input;

				let stockItem: StockItem | undefined;

				if (wordMatch) {
					// 인덱스 가져오기
					stockItem = this.stockList.find((item) => item.alias!.indexOf(wordMatch!) != -1 || item.name == wordMatch);
					if (!stockItem) throw "메뉴가 존재하지 않습니다.";
				} else throw "메뉴가 존재하지 않습니다.";

				let nextWordMatch = nextWord?.match(
					new RegExp(`([1-9]+[0-9]*)|(열|스물|서른|마흔|쉰|예순|일흔|여든|아흔)(하나|둘|셋|다섯|여섯|일곱|여덟|아홉)?|(스무)|(한|하나|두|둘|세|셋|네|넷|다섯|여섯|일곱|여덟|아홉)`)
				)?.input;

				let quantity = 1;

				if (nextWordMatch) {
					i++;
					// 갯수 가져오기
					let matchCount = String(nextWordMatch.replace("개", ""));
					if (!isNaN(Number(matchCount))) quantity = Number(matchCount);
					else if (matchCount in koreanNumber) quantity = koreanNumber[matchCount];
				}

				let prevStockItem = this.shoppingCart.find((s) => s.name == stockItem?.name);
				if (prevStockItem) {
					if (stockItem!.quantity > prevStockItem.quantity) prevStockItem.quantity++;
					else unavailableItems.push(stockItem);
				} else this.shoppingCart.push({ ...stockItem!, quantity: quantity });
			}

			let clearStr = "장바구니에 담긴 제품";
			if (!this.shoppingCart.length) {
				clearStr += "이 없";
				if (unavailableItems.length) clearStr += `으며, 주문 불가능한 제품은 ${unavailableItems.map((s) => s.name).join(",")}입니다.`;
				else clearStr += "습니다.";
			} else {
				clearStr += `은 ${this.shoppingCart.map((item) => item.name).join(",")}`;
				if (unavailableItems.length) clearStr += `이며, 주문 불가능한 제품은 ${unavailableItems.map((s) => s.name).join(",")}입니다.`;
				else clearStr += "입니다.";
			}

			this.$store.state.script = clearStr;
			await this.TTS(clearStr);
		} catch (err) {
			console.error(err);
			this.$store.state.script = script.error;
			await this.playAudio({ isLocal: true, data: "voiceorder/error" });
		}
		this.orderProcess();
	}

	async checkout() {
		this.isRecording = false;
		this.isSpeakable = false;
		this.isOrderProcess = false;

		this.isCheckoutVisible = true;

		this.$store.state.script = script.checkout_complete;
		await this.playAudio({ isLocal: true, data: "voiceorder/checkout_complete" });
	}
}
</script>

<style lang="scss" scoped>
@import "../variables";

@keyframes indicator {
	0% {
		box-shadow: 2px 2px 10px rgba(#000, 0.4);
	}
	50% {
		box-shadow: 3px 3px 20px rgba(#000, 0.7);
	}
	100% {
		box-shadow: 2px 2px 10px rgba(#000, 0.4);
	}
}

.fade-enter-active,
.fade-leave-active {
	transition: 0.3s;
	position: absolute;
	bottom: 0;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
	transform: translateY(100px);
}

.voiceorder {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	width: 100%;
	height: 100%;

	overflow: hidden;

	.dialog {
		position: absolute;
		top: 120px;

		padding: 20px;

		border-radius: 20px;

		background-color: white;
		box-shadow: 0 3px 5px rgba(#000, 0.4);

		font-weight: 500;
		font-size: 1.4em;

		.speech,
		.userText {
			display: flex;
			align-items: center;
		}

		.userText {
			padding-top: 15px;
			margin-top: 15px;
			border-top: 1px solid rgba(#000, 0.3);
		}

		.app-button {
			margin-right: 15px;
			.iconify {
				font-size: 2em;
			}
		}
	}

	.indicator {
		display: flex;
		justify-content: center;
		align-items: center;

		width: 200px;
		height: 200px;

		border-radius: 50%;
		background-color: rgba(#000, 0.3);
		box-shadow: 0 2px 10px rgba(#000, 0.4);

		font-size: 80px;
		color: white;

		&.speakable {
			animation: indicator 1.5s infinite;
			background-color: $primary-color;
		}

		&.recording {
			background-color: #47cf73;
		}
	}

	.shoppingCart-container {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;

		margin: 0 auto;
		margin-bottom: 10px;

		display: flex;
		justify-content: center;
		align-items: center;

		width: 60%;

		z-index: 10000;

		.shoppingCart {
			display: flex;
			flex-direction: column;
			align-items: center;

			border-radius: 20px;

			width: 100%;
			max-width: 500px;

			padding: 20px;

			box-shadow: 0 3px 5px -1px rgba(#000, 0.5);

			.shoppingCart-heading {
				display: flex;
				align-items: center;

				width: 100%;
				margin-bottom: 10px;
			}

			.shoppingCart-item {
				display: flex;
				justify-content: space-between;
				align-items: center;

				width: 100%;

				padding: 10px 0;
				border-bottom: 0.5px solid rgba(#000, 0.15);

				h2 {
					flex: 1;
					padding: 0 4px;
				}
				img {
					width: 50px;
					height: 50px;
					border-radius: 50%;
				}
			}
			.price {
				flex: 1;
				text-align: right;
			}
			.total {
				margin-top: 20px;
				align-self: flex-end;
			}
		}
	}
}

.checkout-container {
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;

	display: flex;
	justify-content: center;
	align-items: flex-end;

	background-color: rgba(#000, 0.5);

	width: 100%;
	height: 100%;

	z-index: 10001;

	.checkout {
		display: flex;
		flex-direction: column;
		align-items: center;

		border-radius: 20px;

		margin-bottom: 15px;

		width: 100%;
		max-width: 500px;

		padding: 20px;

		box-shadow: 0 3px 5px -1px rgba(#000, 0.5);

		.checkout-heading {
			display: flex;
			justify-content: space-between;
			align-items: center;

			width: 100%;
			margin-bottom: 10px;
		}

		img {
			display: block;

			width: calc(50% - 32px);
			max-height: 370px;
		}

		.total {
			margin-top: 20px;
		}
	}
}
</style>

<template>
	<div :class="{ order: !isElectron, 'order-electron': isElectron }">
		<div class="product-list">
			<md-card
				v-for="(item, idx) in stockList"
				:key="idx"
				md-with-hover
				class="product"
				@click.native="addItem(item)"
			>
				<md-ripple>
					<md-card-header v-if="!isElectron">
						<!-- <md-card-media md-ratio="1:1"> -->
						<img :src="item.image" />
						<!-- </md-card-media> -->
						<md-card-header-text>
							<div class="md-title">{{ item.name }}</div>
							<div class="md-subhead">{{ numberFormat(item.price) }}원</div>
						</md-card-header-text>
					</md-card-header>
					<div v-else>
						<md-card-media md-ratio="16:9">
							<img :src="item.image" />
						</md-card-media>
						<md-card-header>
							<div class="md-title">{{ item.name }}</div>
							<div class="md-subhead">{{ numberFormat(item.price) }}원</div>
						</md-card-header>
					</div>
				</md-ripple>
			</md-card>
		</div>

		<div class="cart-container">
			<transition name="fade">
				<app-button v-if="!shoppingCartVisible && shoppingCart.length && !isElectron" class="shoppingCart-toggle" round @click="shoppingCartVisible = true">
					<i class="iconify" data-icon="mdi:chevron-up"></i>
					장바구니 열기
				</app-button>
			</transition>

			<transition name="fade">
				<md-card class="cart" v-if="(shoppingCartVisible && shoppingCart.length) || isElectron">
					<div class="cart-header">
						<h1>장바구니</h1>
						<app-button v-if="!isElectron" round @click="shoppingCartVisible = false">
							<i class="iconify" data-icon="mdi:chevron-down"></i>
							숨기기
						</app-button>
						<app-button v-else round color="accent" :disabled="!shoppingCart.length" @click="shoppingCart.splice(0, shoppingCart.length)">
							<i class="iconify" data-icon="mdi:trash"></i>
							비우기
						</app-button>
					</div>

					<div class="cart-list">
						<div
							v-for="(item, idx) in shoppingCart"
							:key="idx"
							class="cart-item"
						>
							<img :src="item.image" alt="" />
							<div class="control">
								<h2>{{ item.name }}</h2>
								<h3 class="price">{{ numberFormat(item.price * item.quantity) }}원</h3>
								<md-card-actions class="actions">
									<app-button circle dense @click="decreaseItem(item)">-</app-button>
									<h3>{{ item.quantity }}</h3>
									<app-button circle dense @click="increaseItem(item)">+</app-button>
								</md-card-actions>
							</div>
						</div>
					</div>

					<app-button
						:disabled="!shoppingCart.length"
						class="checkout"
						@click="(shoppingCartVisible = false), (isCheckoutVisible = true)"
					>
						{{ getTotalPrice }}원 결제하기
					</app-button>
				</md-card>
			</transition>
		</div>

		<transition name="fade">
			<div v-if="isCheckoutVisible" class="checkout-container">
				<md-card class="checkout">
					<div class="checkout-heading">
						<h1>결제하기</h1>
						<app-button round color="accent" @click="(isCheckoutVisible = false), (shoppingCartVisible = true)">
							<i class="iconify" data-icon="mdi:close"></i>
							취소하기
						</app-button>
					</div>
					<img src="/assets/images/credit_card.svg" alt="Credit Card" />

					<h2 class="total">{{ getTotalPrice }}원을 결제하려면 {{ !isElectron ? "결제 수단을 선택해주세요." : "카드를 삽입해주세요." }}</h2>
				</md-card>
			</div>
		</transition>

		<router-link to="/" class="leave">
			<i class="iconify" data-icon="mdi:arrow-left" />
		</router-link>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import { StockItem } from "@/schema";
import { State } from "vuex-class";

import numberFormat from "@/utils/numberFormat";

@Component({})
export default class Order extends Vue {
	@State("isElectron") isElectron!: boolean;
	@State("stockList") stockList!: StockItem[];

	shoppingCartVisible: boolean = false;
	shoppingCart: StockItem[] = [];

	isCheckoutVisible: boolean = false;

	numberFormat(number: number) {
		return numberFormat(number);
	}

	addItem(item: StockItem) {
		this.shoppingCartVisible = true;

		let prevItem = this.shoppingCart.find((s) => s.name == item.name);
		// 이미 장바구니에 있을 시 개수 +1
		if (prevItem) {
			// 남은 재고량 확인 후 증감
			if (this.stockList.find((i) => i.name == item.name)!.quantity > prevItem.quantity) prevItem.quantity++;
		} else this.shoppingCart.push({ ...item, quantity: 1 });
	}
	increaseItem(item: StockItem) {
		let prevItem = this.shoppingCart.find((i) => i.name == item.name);
		if (this.stockList.find((i) => i.name == item.name)!.quantity > prevItem!.quantity) prevItem!.quantity++;
	}
	decreaseItem(item: StockItem) {
		let prevItem = this.shoppingCart.find((i) => i.name == item.name);
		if (prevItem!.quantity-- <= 1) this.removeItem(item);
	}
	removeItem(item: StockItem) {
		let prevItemIdx = this.shoppingCart.findIndex((i) => i.name == item.name);
		if (prevItemIdx != -1) this.shoppingCart.splice(prevItemIdx, 1);
	}

	get getTotalPrice(): string {
		let total = 0;
		this.shoppingCart.forEach((i) => {
			total += i.price * i.quantity;
		});
		return numberFormat(total);
	}
}
</script>

<style lang="scss" scoped>
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

[class^="order"] {
	display: flex;

	width: 100%;
	height: 100%;
	max-height: 100vh;
}

.product-list {
	display: grid;
	align-content: flex-start;
	grid-template-columns: repeat(auto-fill, minmax(256px, 1fr));
	gap: 16px;

	flex: 1 1 0;
	padding: 16px;

	overflow: hidden auto;

	.product {
		height: fit-content;
	}
}

.cart-container {
	flex: 0 0 320px;
}
.cart {
	display: flex;
	flex-direction: column;

	height: 100%;

	.cart-header {
		display: flex;
		justify-content: space-between;
		align-items: center;

		flex: 0 0 56px;
		padding: 8px;

		h1 {
			font-size: 24px;
			font-weight: bold;
		}
	}

	.cart-list {
		flex: 1 1 100%;
		height: 0;

		overflow: hidden auto;

		.cart-item {
			display: flex;
			height: 96px;
			border-bottom: 1px solid #EEE;

			&:first-child {
				border-top: 1px solid #EEE;
			}

			img {
				flex: 0 0 96px;
				width: 96px;
				height: 100%;

				object-fit: cover;
			}
			.control {
				display: flex;
				flex-direction: column;

				flex: 1 1 0;
				height: 100%;
				padding: 8px;

				h2 {
					width: 100%;
					overflow: hidden;

					font-size: 20px;
					font-weight: bold;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
				.price {
					margin-bottom: auto;
				}

				.actions {
					display: flex;

					padding: 0;

					font-size: 18px;
					font-weight: bold;

					h3 {
						width: 64px;
						margin: 0 8px;
						overflow: hidden;

						text-align: center;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
				}
			}
		}
	}
	.checkout {
		flex: 0 0 64px;
		width: 100%;
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

.leave {
	display: flex;
	justify-content: center;
	align-items: center;

	position: fixed;
	z-index: 2048;
	bottom: 12px;
	left: 12px;

	width: 48px;
	height: 48px;

	border-radius: 24px;

	background-color: #ff5252;

	color: white !important;
	font-size: 32px;
	text-align: center;
}

@media screen and (max-width: 900px) {
	[class^="order"] {
		flex-direction: column;
	}
	.cart-container {
		width: 100%;
		height: 320px;
	}
}
</style>

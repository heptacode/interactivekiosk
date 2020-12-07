<template>
	<div :class="{ order: !isElectron, 'order-electron': isElectron }">
		<div class="product-container">
			<div v-for="(item, idx) in stockList" :key="idx" class="product" @click="addItem(item)">
				<md-card md-with-hover>
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
						<!-- <md-card-actions>
							<md-button>-</md-button>
							<md-button>+</md-button>
						</md-card-actions> -->
					</md-ripple>
				</md-card>
			</div>
		</div>

		<div class="shoppingCart-container">
			<transition name="fade">
				<app-button v-if="!shoppingCartVisible && shoppingCart.length && !isElectron" class="round shoppingCart-toggle" @click="shoppingCartVisible = true">
					<i class="iconify" data-icon="mdi:chevron-up"></i>
					장바구니 열기
				</app-button>
			</transition>

			<!-- <shoppingCart> -->
			<transition name="fade">
				<md-card class="shoppingCart" v-if="(shoppingCartVisible && shoppingCart.length) || isElectron">
					<div class="shoppingCart-heading">
						<h1>장바구니</h1>
						<app-button v-if="!isElectron" class="round" @click="shoppingCartVisible = false">
							<i class="iconify" data-icon="mdi:chevron-down"></i>
							숨기기
						</app-button>
					</div>

					<div v-for="(item, idx) in shoppingCart" :key="idx" class="shoppingCart-item">
						<img :src="item.image" alt="" />
						<h2>{{ item.name }}</h2>

						<md-card-actions class="shoppingCart-actions">
							<app-button class="md-icon-button" @click="decreaseItem(item)">-</app-button>
							<h3>&times;{{ item.quantity }}</h3>
							<app-button class="md-icon-button" @click="increaseItem(item)">+</app-button>
						</md-card-actions>
						<h3 class="price">{{ numberFormat(item.price * item.quantity) }}원</h3>
					</div>

					<app-button v-if="shoppingCart.length" class="round checkout" @click="checkout"> {{ getTotalPrice }}원 결제하기 </app-button>
				</md-card>
			</transition>
			<!-- </shoppingCart> -->
		</div>

		<div class="sidebar"></div>
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

	checkout() {
		// TODO : 결제
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

.order {
	display: flex;
	flex-direction: column;

	height: 100%;

	.product-container {
		display: flex;
		flex-direction: column;
		align-items: center;

		.product {
			width: 100%;
			.md-ripple {
				height: 90px;
				img {
					width: 60px;
					height: 60px;
				}
				.md-title {
					margin: 0;
				}
				.md-card-header-text {
					display: flex;
					flex-direction: column;
					justify-content: center;
				}
			}
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

		.shoppingCart-toggle {
			padding: 10px;
		}
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
				justify-content: space-between;
				align-items: center;

				width: 100%;
				margin-bottom: 10px;
			}

			.shoppingCart-item {
				display: flex;
				align-items: center;

				width: 100%;

				padding: 10px 0;
				border-bottom: 0.5px solid rgba(#000, 0.15);

				h2 {
					padding: 0 4px;
				}
				img {
					width: 50px;
					height: 50px;
					border-radius: 50%;
				}
			}

			h2 {
				flex: 2;
			}
			.shoppingCart-actions {
				flex: 1;
				h4 {
					padding: 0 10px;
				}
			}
			.price {
				flex: 1;
				text-align: right;
			}
			.checkout {
				margin-top: 20px;
				align-self: flex-end;
			}
		}
	}
}

.order-electron {
	display: flex;
	height: 100%;

	.product-container {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;

		row-gap: 30px;
		column-gap: 30px;

		width: 70%;
		height: fit-content;

		padding: 30px;

		box-shadow: 1px 0 40px rgba(#000, 0.1);
	}

	.shoppingCart-container {
		display: flex;
		flex-direction: column;

		position: relative;

		width: 30%;
		height: 100%;

		padding: 30px;

		.shoppingCart {
			box-shadow: none;
			background-color: transparent;
			margin-top: 20px;

			.shoppingCart-heading {
				margin-bottom: 40px;
				h1 {
					font-size: 2.5em;
				}
			}

			.shoppingCart-item {
				display: flex;
				justify-content: space-between;
				align-items: center;

				padding: 20px 0;
				border-bottom: 0.5px solid rgba(#000, 0.15);

				img {
					width: 50px;
					height: 50px;

					border-radius: 50%;
				}

				h3 {
					padding: 0 10px;
				}
			}

			.checkout {
				margin-top: 40px;
				width: 100%;
				height: 50px;
			}
		}
	}
}
</style>

<template>
	<div class="order" :class="{ electron: isElectron }">
		<div class="product-container">
			<div v-for="(item, idx) in stockList" :key="idx" class="product" @click="addItem(item)">
				<md-card md-with-hover>
					<md-ripple>
						<md-card-header v-if="!isElectron">
							<!-- <md-card-media md-ratio="1:1"> -->
							<img :src="`assets/products/${item.image}`" />
							<!-- </md-card-media> -->
							<md-card-header-text>
								<div class="md-title">{{ item.name }}</div>
								<div class="md-subhead">{{ numberFormat(item.price) }}원</div>
							</md-card-header-text>
						</md-card-header>
						<div v-else>
							<md-card-media md-ratio="16:9">
								<img :src="`assets/products/${item.image}`" />
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

		<!-- shoppingCart -->
		<md-card v-if="shoppingCart.length" class="shoppingCart" md-with-hover>
			<div v-for="(item, idx) in shoppingCart" :key="idx" class="shoppingCart-item">
				<img :src="`assets/products/${item.image}`" alt="" />
				<p class="shoppingCart-item__info">{{ item.name }} x {{ item.quantity }} - {{ item.price * item.quantity }}원</p>

				<md-card-actions>
					<md-button>-</md-button>
					<md-button>+</md-button>
				</md-card-actions>
				<div>
					<button class="shoppingCart-item__decrease" @click="decreaseItem(item)">-</button>
					{{ item.quantity }}
					<button class="shoppingCart-item__increase" @click="increaseItem(item)">+</button>
				</div>
				<button class="shoppingCart-item__remove" @click="removeItem(item)"><i class="iconify" data-icon="mdi:trash" />삭제</button>
			</div>
			<app-button class="submit" @click="checkout">주문하기</app-button>
		</md-card>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import numberFormat from "@/utils/numberFormat";

import { StockItem } from "@/schema";
import { mapState } from "vuex";
import { State } from "vuex-class";

@Component({})
export default class Order extends Vue {
	@State("isElectron") isElectron!: boolean;
	@State("stockList", { namespace: "StockListModule" }) stockList!: StockItem[];
	shoppingCart: StockItem[] = [];

	numberFormat(number: number) {
		return numberFormat(number);
	}

	addItem(stock: StockItem) {
		let prevStock = this.shoppingCart.find((s) => s.name == stock.name);
		// 이미 장바구니에 있을 시 개수 +1
		if (prevStock) {
			// 남은 재고량 확인 후 증감
			if (this.stockList.find((s) => s.name == stock.name)!.quantity > prevStock.quantity) prevStock.quantity++;
		} else this.shoppingCart.push({ ...stock, quantity: 1 });
	}

	increaseItem(item: StockItem) {
		// TODO : 장바구니에 담겨있는 제품 수량 증감
	}

	decreaseItem(item: StockItem) {
		// TODO : 장바구니에 담겨있는 제품 수량 차감
	}

	removeItem(item: StockItem) {
		let prevStockIdx = this.shoppingCart.findIndex((s) => s.name == item.name);
		if (prevStockIdx != -1) this.shoppingCart.splice(prevStockIdx, 1);
	}

	checkout() {
		// TODO : 결제
	}
}
</script>

<style lang="scss" scoped>
.order {
	display: flex;
	flex-direction: column;
	margin-bottom: 80vh;

	.product-container {
		display: flex;
		flex-direction: column;
		// justify-content: flex-start;
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
		// flex-wrap: wrap;
		// .product {
		// 	width: 30%;

		// 	margin: 10px;

		// 	border: none;
		// 	border-radius: 20px;
		// 	box-shadow: 3px 3px 20px rgba($color: #000000, $alpha: 0.1);

		// 	.product-group {
		// 		flex-direction: column;
		// 		justify-content: center;
		// 		align-items: center;

		// 		.product-innergroup {
		// 			align-items: center;
		// 		}
		// 	}
	}

	&.electron {
		.product-container {
			padding: 20px;

			display: grid;

			grid-template-columns: 1fr 1fr 1fr;

			row-gap: 30px;
			column-gap: 30px;
		}

		.shoppingCart {
			position: absolute;
			left: 0;
			bottom: 0;

			padding: 20px;

			display: flex;
			flex-direction: column;

			z-index: 1000;
		}
	}

	// .shoppingCart-item {
	// 	position: relative;

	// 	display: flex;
	// 	align-items: center;

	// 	padding: 10px;

	// 	.stock-buyitem__imagebox {
	// 		width: 4em;
	// 		height: 4em;

	// 		border-radius: 20px;
	// 		background: linear-gradient(145deg, #e6e6e6, #ffffff);
	// 		box-shadow: 6px 6px 12px #c2c2c2, -6px -6px 12px #ffffff;

	// 		overflow: hidden;

	// 		img {
	// 			height: 100%;
	// 		}
	// 	}
	// 	.stock-buyitem__info {
	// 		margin-left: 20px;
	// 		font-size: 1.2em;
	// 	}
	// 	.stock-buyitem__remove {
	// 		position: absolute;
	// 		right: 5px;
	// 		top: 5px;

	// 		padding: 5px;

	// 		display: flex;
	// 		justify-content: center;
	// 		align-items: center;

	// 		border-radius: 100%;

	// 		background-color: #cc6666;
	// 		color: white;
	// 	}
	// }

	// .submit {
	// 	margin-top: 20px;
	// }
}
</style>

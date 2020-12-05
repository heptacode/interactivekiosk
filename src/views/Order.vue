<template>
	<div class="order">
		<div class="stock-list">
			<div v-for="(stock, idx) in stockList" :key="idx" @click="buyStockItem(stock)">
				<md-card md-with-hover class="stock-item">
					<md-ripple>
						<md-card-media md-ratio="16:9">
							<img :src="`assets/products/${stock.image}`" />
						</md-card-media>
						<md-card-header>
							<div class="md-title">{{ stock.name }}</div>
							<div class="md-subhead">{{ stock.quantity }}</div>
						</md-card-header>

						<md-card-content> {{ stock.price }} 원</md-card-content>

						<!-- <md-card-actions>
							<md-button>-</md-button>
							<md-button>+</md-button>
						</md-card-actions> -->
					</md-ripple>
				</md-card>
			</div>
		</div>
		<md-card md-with-hover class="stock-buylist" v-if="buyStockList.length">
			<div class="stock-buyitem" v-for="(stock, idx) in buyStockList" :key="idx">
				<div class="stock-buyitem__imagebox">
					<img :src="`assets/products/${stock.image}`" alt="" />
				</div>
				<p class="stock-buyitem__info">{{ stock.name }} x {{ stock.quantity }} - {{ stock.price * stock.quantity }}원</p>
				<button class="stock-buyitem__remove" @click="removeStockItem(stock)">
					<i data-icon="mdi-close" class="iconify" />
				</button>
			</div>
			<app-button class="submit" @click="submit">주문하기</app-button>
		</md-card>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import STT from "@/components/util/STT.vue";

import { StockItem } from "@/schema";
import { mapState } from "vuex";
import { State } from "vuex-class";

@Component({})
export default class Order extends Vue {
	buyStockList: StockItem[] = [];

	@State("stockList", { namespace: "StockListModule" }) stockList!: StockItem[];

	// 아이템 구매 로직
	buyStockItem(stock: StockItem) {
		let prevStock = this.buyStockList.find((s) => s.name == stock.name);
		// 이미 장바구니에 있을 시 갯수 +1
		if (prevStock) {
			// 남은 재고량 확인 후 ++
			if (this.stockList.find((s) => s.name == stock.name)!.quantity > prevStock.quantity) prevStock.quantity++;
		} else this.buyStockList.push({ ...stock, quantity: 1 });
	}
	removeStockItem(stock: StockItem) {
		let prevStockIdx = this.buyStockList.findIndex((s) => s.name == stock.name);
		if (prevStockIdx != -1) this.buyStockList.splice(prevStockIdx, 1);
	}

	submit() {
		// TODO: 구매 (buyStockList)
	}
}
</script>

<style lang="scss" scoped>
.order {
	display: flex;
	flex-direction: column;
	margin-bottom: 80vh;
	.stock-list {
		padding: 20px;

		display: grid;

		grid-template-columns: 1fr 1fr 1fr;

		row-gap: 30px;
		column-gap: 30px;

		.stock-item {
		}
	}

	.stock-buylist {
		position: absolute;
		left: 0;
		bottom: 0;

		padding: 20px;

		display: flex;
		flex-direction: column;

		z-index: 1000;

		.stock-buyitem {
			position: relative;

			display: flex;
			align-items: center;

			padding: 10px;

			.stock-buyitem__imagebox {
				width: 4em;
				height: 4em;

				border-radius: 20px;
				background: linear-gradient(145deg, #e6e6e6, #ffffff);
				box-shadow: 6px 6px 12px #c2c2c2, -6px -6px 12px #ffffff;

				overflow: hidden;

				img {
					height: 100%;
				}
			}
			.stock-buyitem__info {
				margin-left: 20px;
				font-size: 1.2em;
			}
			.stock-buyitem__remove {
				position: absolute;
				right: 5px;
				top: 5px;

				padding: 5px;

				display: flex;
				justify-content: center;
				align-items: center;

				border-radius: 100%;

				background-color: #cc6666;
				color: white;
			}
		}

		.submit {
			margin-top: 20px;
		}
	}
}
</style>

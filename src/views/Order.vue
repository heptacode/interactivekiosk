<template>
	<div class="order">
		<div class="stock-list">
			<div v-for="(stock, idx) in stockList" :key="idx" class="stock-item" @click="buyStockItem(stock)">
				<div class="stock-item__imagebox">
					<img :src="`assets/products/${stock.image}`" alt="" />
				</div>
				<h3 class="stock-item__name">{{ stock.name }}</h3>
				<p class="stock-item__price">{{ stock.price }}원</p>
			</div>
		</div>
		<div class="stock-buylist" v-if="stockBuyList.length">
			<div class="stock-buyitem" v-for="(stock, idx) in stockBuyList" :key="idx">
				<div class="stock-buyitem__imagebox">
					<img :src="`assets/products/${stock.image}`" alt="" />
				</div>
				<p class="stock-buyitem__info">{{ stock.name }} x {{ stock.quantity }} - {{ stock.price * stock.quantity }}원</p>
				<button class="stock-buyitem__remove" @click="removeStockItem(stock)">
					<i data-icon="mdi-close" class="iconify" />
				</button>
			</div>
			<app-button class="submit" @click="submit">주문하기</app-button>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import AppButton from "@/components/AppButton.vue";
import STT from "@/components/util/STT.vue";

import { StockItem } from "@/schema";
import { mapState } from "vuex";
import { State } from "vuex-class";

@Component({
	components: {
		AppButton,
	},
})
export default class Order extends Vue {
	stockBuyList: StockItem[] = [];

	@State("stockList", { namespace: "StockListModule" }) stockList!: StockItem[];

	// 아이템 구매 로직
	buyStockItem(stock: StockItem) {
		let prevStock = this.stockBuyList.find((s) => s.name == stock.name);
		// 이미 장바구니에 있을 시 갯수 +1
		if (prevStock) {
			// 남은 재고량 확인 후 ++
			if (this.stockList.find((s) => s.name == stock.name)!.quantity > prevStock.quantity) prevStock.quantity++;
		} else this.stockBuyList.push({ ...stock, quantity: 1 });
	}
	removeStockItem(stock: StockItem) {
		let prevStockIdx = this.stockBuyList.findIndex((s) => s.name == stock.name);
		if (prevStockIdx != -1) this.stockBuyList.splice(prevStockIdx, 1);
	}

	submit() {
		// TODO: 구매 (stockBuyList)
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
			cursor: pointer;
			-webkit-user-select: none;

			display: flex;
			flex-direction: column;

			overflow: hidden;

			border-radius: 20px;
			background: linear-gradient(145deg, #e6e6e6, #ffffff);
			box-shadow: 6px 6px 12px #c2c2c2, -6px -6px 12px #ffffff;

			padding: 20px;

			&:active {
				background: #eeeeee;
				box-shadow: inset 6px 6px 12px #c2c2c2, inset -6px -6px 12px #ffffff;
			}

			.stock-item__imagebox {
				width: 100%;
				height: 25vw;

				background-color: #aaaaaa;

				border-radius: 20px;

				display: flex;
				justify-content: center;
				align-items: center;

				overflow: hidden;
				img {
					-webkit-user-drag: none;
					height: 100%;
				}
			}
			.stock-item__name {
				margin-top: 20px;

				font-size: 1.5em;
			}
			.stock-item__price {
				margin-top: 5px;
				font-size: 1.2em;
			}
		}
	}

	.stock-buylist {
		position: absolute;
		left: 0;
		bottom: 0;

		padding: 20px;

		display: flex;
		flex-direction: column;

		border-radius: 0 20px 0 0;
		background: linear-gradient(145deg, #e6e6e6, #ffffff);
		box-shadow: 6px 6px 12px #c2c2c2, -6px -6px 12px #ffffff;

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

				background-color: #aa3333;
				color: white;
			}
		}

		.submit {
			margin-top: 20px;
		}
	}
}
</style>

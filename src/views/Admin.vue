<template>
	<div class="admin">
		<div class="product-container">
			<md-card v-for="(item, idx) in stockList" :key="idx" class="product md-size-50 md-small-size-100">
				<md-card-header>
					<img :src="`assets/products/${item.image}`" />
				</md-card-header>
				<md-card-content>
					<div class="md-layout md-gutter">
						<md-field class="md-layout-item md-small-size-100">
							<label>제품명</label>
							<md-input v-model="item.name"></md-input>
						</md-field>
						<md-field class="md-layout-item md-small-size-100">
							<label>별칭 (쉼표로 구분)</label>
							<md-input v-model="item.alias" @change="updateItem(alias)"></md-input>
						</md-field>
						<md-field class="md-layout-item md-small-size-100">
							<label>가격</label>
							<span class="md-prefix"><i class="iconify" data-icon="mdi:currency-krw"></i></span>
							<md-input v-model="item.price"></md-input>
						</md-field>
						<md-field class="md-layout-item md-small-size-100">
							<label>재고 수량</label>
							<md-input v-model="item.quantity"></md-input>
							<span class="md-suffix">개</span>
						</md-field>
					</div>
				</md-card-content>
			</md-card>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import { StockItem } from "@/schema";
import { State } from "vuex-class";

import numberFormat from "@/utils/numberFormat";

@Component({})
export default class Admin extends Vue {
	@State("isElectron") isElectron!: boolean;
	@State("stockList") stockList!: StockItem[];

	selectedItem: boolean = false;

	numberFormat(number: number) {
		return numberFormat(number);
	}

	updateItem(key: string) {}

	selectItem(item: StockItem[]) {}
}
</script>

<style lang="scss" scoped>
.admin {
	display: flex;
	flex-direction: column;

	height: 100%;

	.hgroup {
		display: flex;

		.md-field {
			margin-left: 20px;
		}
	}

	.product-container {
		display: flex;
		flex-direction: column;
		align-items: center;

		.product {
			display: flex;
			align-items: center;

			width: 100%;

			border-bottom: 1px solid rgba(0, 0, 0, 0.15);

			img {
				display: block;

				margin-right: 30px;

				width: 60px;
				height: 60px;

				border-radius: 50%;
			}

			.md-layout {
				display: flex;
				flex-direction: column;
				flex-wrap: wrap;
			}
		}
	}
}
</style>

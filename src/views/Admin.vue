<template>
	<div class="admin">
		<div class="product-container">
			<div v-for="(item, idx) in stockList" :key="idx" class="product" @click="selectItem(item)">
				<md-card md-with-hover>
					<md-ripple>
						<md-card-header>
							<!-- <md-card-media md-ratio="1:1"> -->
							<img :src="`assets/products/${item.image}`" />
							<!-- </md-card-media> -->
							<md-card-header-text>
								<div class="md-title">{{ item.name }}</div>
								<div class="md-subhead">{{ numberFormat(item.price) }}원</div>
							</md-card-header-text>
						</md-card-header>

						<md-card-content>
							{{ item.quantity }}개 남음<br />
							<!-- TODO : 태그형으로 구현 -->
							별칭 : {{ item.alias.join(", ") }}
						</md-card-content>

						<!-- <md-card-actions>
							<md-button>-</md-button>
							<md-button>+</md-button>
						</md-card-actions> -->
					</md-ripple>
				</md-card>
			</div>
			<!-- <div class="admin">
		<div v-for="(item, idx) in stockList" :key="idx">
			{{ item }}
		</div>
	</div> -->
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

	selectItem(item: StockItem[]) {}
}
</script>

<style lang="scss" scoped>
.admin {
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
				// height: 90px;
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
}
</style>

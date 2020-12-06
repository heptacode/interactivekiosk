<template>
	<div class="admin">
		<div class="product-container">
			<md-card v-for="(item, idx) in stockList" :key="idx" class="product">
				<md-card-header>
					<img :src="`assets/products/${item.image}`" />
				</md-card-header>
				<md-card-content class="product-content">
					<div class="md-layout md-gutter">
						<md-field class="md-layout-item">
							<label>제품명</label>
							<md-input v-model="item.name" @change="updateItem({ key: 'name', id: item.id, value: item.name })"></md-input>
						</md-field>
						<md-field class="md-layout-item">
							<label>별칭 (쉼표로 구분)</label>
							<md-input v-model="item.alias" @change="updateItem({ key: 'alias', id: item.id, value: item.alias })"></md-input>
						</md-field>
					</div>
					<div class="md-layout md-gutter">
						<md-field class="md-layout-item">
							<label>가격</label>
							<span class="md-prefix"><i class="iconify" data-icon="mdi:currency-krw"></i></span>
							<md-input type="tel" v-model="item.price" @change="updateItem({ key: 'price', id: item.id, value: item.price })"></md-input>
						</md-field>
						<md-field class="md-layout-item">
							<label>재고 수량</label>
							<md-input type="number" v-model="item.quantity" min="0" max="99" @change="updateItem({ key: 'quantity', id: item.id, value: item.quantity })"></md-input>
							<span class="md-suffix">개</span>
						</md-field>
					</div>

					<md-card-actions>
						<app-button class="round" @click="duplicateItem({ id: item.id, itemData: item })">
							<i class="iconify" data-icon="mdi:content-copy"></i>
							복제
						</app-button>
						<app-button class="round md-accent" @click="deleteItem(item.id)">
							<i class="iconify" data-icon="mdi:trash"></i>
							삭제
						</app-button>
					</md-card-actions>
				</md-card-content>
			</md-card>
		</div>

		<app-button class="md-fab md-mini createItem" @click="isItemCreatorVisible = true">
			<i class="iconify" data-icon="mdi:plus"></i>
		</app-button>

		<div v-if="isItemCreatorVisible" class="itemCreator-container">
			<md-card class="itemCreator">
				<div class="itemCreator-heading">
					<h1>제품 추가</h1>
					<app-button class="md-icon-button md-accent md-dense" @click="(isItemCreatorVisible = false), (itemCreatorData = [])">
						<i class="iconify" data-icon="mdi:close"></i>
					</app-button>
				</div>

				<div class="itemCreator-item">
					<app-button class="md-icon-button imageContainer">
						<span v-if="!itemCreatorData.image">
							<i class="iconify" data-icon="mdi:plus"></i>
						</span>
						<img v-else :src="`assets/products/${itemCreatorData.image}`" alt="" />
					</app-button>
					<h2>{{ itemCreatorData.name }}</h2>

					<md-card-actions class="itemCreator-actions"> </md-card-actions>
					<h4>{{ numberFormat(itemCreatorData.price * itemCreatorData.quantity) }}원</h4>
				</div>

				<app-button class="round submit" :disabled="itemCreatorData.name && itemCreatorData.price && itemCreatorData.quantity" @click="createItem(itemCreatorData)">
					완료
				</app-button>
			</md-card>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import { StockItem } from "@/schema";
import { Action, State } from "vuex-class";

import numberFormat from "@/utils/numberFormat";

@Component({})
export default class Admin extends Vue {
	@State("isElectron") isElectron!: boolean;
	@State("stockList") stockList!: StockItem[];

	@Action("CREATE_ITEM", { namespace: "FirestoreModule" }) createItem!: Function;
	@Action("UPDATE_ITEM", { namespace: "FirestoreModule" }) updateItem!: Function;
	@Action("DUPLICATE_ITEM", { namespace: "FirestoreModule" }) duplicateItem!: Function;
	@Action("DELETE_ITEM", { namespace: "FirestoreModule" }) deleteItem!: Function;

	isItemCreatorVisible: boolean = false;
	itemCreatorData: StockItem = {} as StockItem;

	numberFormat(number: number) {
		return numberFormat(number);
	}
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

			padding: 20px;

			border-bottom: 1px solid rgba(0, 0, 0, 0.15);
			img {
				display: block;

				margin-right: 30px;

				width: 60px;
				height: 60px;

				border-radius: 50%;
			}

			.md-layout-item {
				margin-left: 15px;
			}
			.product-content {
				width: 100%;
				padding-bottom: 0;
			}
		}
	}

	.createItem {
		position: absolute;
		top: auto;
		right: 12px;
		bottom: 10px;
		left: auto;
	}

	.itemCreator-container {
		position: fixed;
		top: auto;
		bottom: 0;

		display: flex;
		justify-content: center;
		align-items: center;

		width: 100%;
		margin-bottom: 10px;

		z-index: 10000;

		.itemCreator {
			display: flex;
			flex-direction: column;
			align-items: center;

			border-radius: 20px;

			width: 80%;
			max-width: 500px;

			padding: 20px;

			box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.5);

			.itemCreator-heading {
				display: flex;
				justify-content: space-between;
				align-items: center;

				width: 100%;
				margin-bottom: 10px;
			}

			.itemCreator-item {
				display: flex;
				justify-content: space-between;
				align-items: center;

				width: 100%;

				padding: 10px 0;

				border-bottom: 0.5px solid rgba(0, 0, 0, 0.15);

				h2 {
					padding: 0 4px;
				}
				img {
					width: 50px;
					height: 50px;
					border-radius: 50%;
				}
			}

			.itemCreator-actions {
				h4 {
					padding: 0 10px;
				}
			}
			.submit {
				margin-top: 20px;
				padding: 10px;
				align-self: flex-end;
			}
		}
	}
}
</style>

<template>
	<div class="admin">
		<div class="product-container">
			<md-card v-for="(item, idx) in stockList" :key="idx" class="product">
				<md-card-header>
					<!-- TODO: 이미지 클릭시 변경  -->
					<img :src="item.image" @click="/*updateImage(item.id)*/" />
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

		<app-button v-if="!isItemCreatorVisible" class="md-fab md-mini createItem" @click="isItemCreatorVisible = true">
			<i class="iconify" data-icon="mdi:plus"></i>
		</app-button>

		<div v-else class="itemCreator-container">
			<md-card class="itemCreator">
				<form action="javascript:void(0)" @submit="submitItemCreator">
					<div class="itemCreator-heading">
						<h1>제품 추가</h1>
						<app-button class="md-icon-button md-accent md-dense" @click="resetItemCreator">
							<i class="iconify" data-icon="mdi:close"></i>
						</app-button>
					</div>

					<div class="itemCreator-item">
						<label class="itemCreator-item-image">
							<span v-if="!itemCreatorData.image.blobURL">
								<i class="iconify" data-icon="mdi:image-plus"></i>
							</span>
							<img v-else :src="itemCreatorData.image.blobURL" alt="" />
							<input type="file" ref="itemCreatorImage" accept="image/*" :disabled="isItemCreating" @change="onImageChange" style="display:none" />
						</label>

						<div class="md-layout">
							<md-field>
								<label>제품명</label>
								<md-input v-model="itemCreatorData.name" :disabled="isItemCreating" required></md-input>
							</md-field>
							<md-field>
								<label>별칭 (쉼표로 구분)</label>
								<md-input v-model="itemCreatorData.alias" :disabled="isItemCreating" required></md-input>
							</md-field>
							<md-field class="md-layout-item" style="padding-left: 0">
								<label>가격</label>
								<span class="md-prefix"><i class="iconify" data-icon="mdi:currency-krw"></i></span>
								<md-input type="tel" v-model="itemCreatorData.price" :disabled="isItemCreating" required></md-input>
							</md-field>
							<md-field class="md-layout-item">
								<label>재고 수량</label>
								<md-input type="number" v-model="itemCreatorData.quantity" min="0" max="99" :disabled="isItemCreating" required></md-input>
								<span class="md-suffix">개</span>
							</md-field>
						</div>
					</div>

					<md-card-actions>
						<app-button
							type="submit"
							class="round submit"
							:disabled="!itemCreatorData.name || !itemCreatorData.alias || !itemCreatorData.price || !itemCreatorData.quantity || isItemCreating"
						>
							{{ !isItemCreating ? "완료" : "기다리십시오 ..." }}
						</app-button>
					</md-card-actions>
				</form>
			</md-card>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import { StockItem, ItemCreatorData } from "@/schema";
import { Action, State } from "vuex-class";

import numberFormat from "@/utils/numberFormat";
import imageToBase64 from "@/utils/imageToBase64";
import { Item } from "electron";

@Component({})
export default class Admin extends Vue {
	@State("isElectron") isElectron!: boolean;
	@State("stockList") stockList!: StockItem[];

	@Action("CREATE_ITEM", { namespace: "FirestoreModule" }) createItem!: Function;
	@Action("UPDATE_ITEM", { namespace: "FirestoreModule" }) updateItem!: Function;
	@Action("DUPLICATE_ITEM", { namespace: "FirestoreModule" }) duplicateItem!: Function;
	@Action("DELETE_ITEM", { namespace: "FirestoreModule" }) deleteItem!: Function;

	isItemCreatorVisible: boolean = false;
	itemCreatorData: ItemCreatorData = {} as ItemCreatorData;
	isItemCreating: boolean = false;

	mounted() {
		this.resetItemCreator();
	}

	resetItemCreator() {
		this.isItemCreatorVisible = this.itemCreating = false;
		this.itemCreatorData = {
			name: "",
			alias: "",
			price: 0,
			quantity: 1,
			image: { name: "", blobURL: "", data: "" },
		};
	}

	numberFormat(number: number) {
		return numberFormat(number);
	}

	async onImageChange() {
		if (this.itemCreatorData.image && this.itemCreatorData.image.blobURL !== "") URL.revokeObjectURL(this.itemCreatorData.image.blobURL);

		let imageDOM = this.$refs.itemCreatorImage["files"][0];
		let blobURL = URL.createObjectURL(imageDOM);

		this.itemCreatorData.image = {
			name: imageDOM.name,
			blobURL: blobURL,
			data: await imageToBase64(blobURL),
		};
	}

	async submitItemCreator() {
		this.isItemCreating = true;
		let result = await this.createItem(this.itemCreatorData);
		if (result) this.resetItemCreator();
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

			border-bottom: 1px solid rgba(#000, 0.15);
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

			box-shadow: 0 3px 5px -1px rgba(#000, 0.5);

			.itemCreator-heading {
				display: flex;
				justify-content: space-between;
				align-items: center;

				width: 100%;
				margin-bottom: 10px;
			}

			.itemCreator-item {
				display: flex;
				flex-direction: column;
				align-items: flex-start;

				width: 100%;

				padding: 10px 0;

				border-bottom: 0.5px solid rgba(#000, 0.15);

				.itemCreator-item-image {
					display: flex;
					justify-content: center;
					align-items: center;

					width: 50px;
					height: 50px;

					margin-left: 10px;

					border-radius: 50%;

					box-shadow: 1px 1px 8px rgba(#000, 0.15);
					transition: 0.3s;

					cursor: pointer;

					&:hover {
						box-shadow: 1px 1px 8px rgba(#000, 0.25);
					}

					img {
						width: 50px;
						height: 50px;

						border-radius: 50%;
					}
				}
			}
			.md-field {
				margin: 15px;
			}
			.submit {
				margin-top: 8px;
				padding: 10px;
			}
		}
	}
}
</style>

<template>
	<div class="admin">
		<div class="actions">
			<app-button round color="default" @click="testNotification">
				<i class="iconify" data-icon="mdi:bell"></i>
				푸시 알림 테스트
			</app-button>
		</div>

		<h1 class="title">재고 관리</h1>

		<div class="product-info">품목 : {{ stockList.length }}개 / 총 수량 : {{ getTotalQuantity }}개</div>

		<div class="product-container">
			<transition-group name="slide">
				<div v-for="(item, idx) in stockList" :key="item.id">
					<md-card class="product">
						<md-card-header>
							<label>
								<img :src="item.image" :alt="item.name" />
								<input type="file" ref="image" accept="image/*" :disabled="isItemCreating" @change="onImageChange(item.id, idx)" style="display:none" />
							</label>
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
								<app-button round @click="duplicateItem({ id: item.id, itemData: item })">
									<i class="iconify" data-icon="mdi:content-copy"></i>
									복제
								</app-button>
								<app-button round color="accent" @click="deleteItem(item.id)">
									<i class="iconify" data-icon="mdi:trash"></i>
									삭제
								</app-button>
							</md-card-actions>
						</md-card-content>
					</md-card>
					<md-progress-bar v-if="imageUploadIdx === idx" md-mode="determinate" :md-value="imageUploadProgress"></md-progress-bar>
				</div>
			</transition-group>
		</div>

		<transition v-if="!isItemCreatorVisible" name="fade">
			<app-button class="createItem" fab @click="isItemCreatorVisible = true">
				<i class="iconify" data-icon="mdi:plus"></i>
			</app-button>
		</transition>

		<transition v-else name="fade">
			<div class="itemCreator-container">
				<md-card class="itemCreator">
					<form action="javascript:void(0)" @submit="submitItemCreator">
						<div class="itemCreator-heading">
							<h1>제품 추가</h1>
							<app-button circle dense color="accent" @click="resetItemCreator">
								<i class="iconify" data-icon="mdi:close"></i>
							</app-button>
						</div>

						<div class="itemCreator-item">
							<label class="itemCreator-item-image">
								<span v-if="!itemCreatorData.image.blobURL">
									<i class="iconify" data-icon="mdi:image-plus"></i>
								</span>
								<img v-else :src="itemCreatorData.image.blobURL" :alt="itemCreatorData.name" />
								<input type="file" ref="itemCreatorImage" accept="image/*" :disabled="isItemCreating" @change="onItemCreatorImageChange" style="display:none" />
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
								class="submit"
								round
								:disabled="!itemCreatorData.name || !itemCreatorData.alias || !itemCreatorData.price || !itemCreatorData.quantity || isItemCreating"
							>
								{{ !isItemCreating ? "완료" : "기다리십시오 ..." }}
							</app-button>
						</md-card-actions>
					</form>
				</md-card>
			</div>
		</transition>
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
	@State("imageUploadProgress", { namespace: "FirestoreModule" }) imageUploadProgress!: number;

	@Action("CREATE_ITEM", { namespace: "FirestoreModule" }) createItem!: Function;
	@Action("UPDATE_ITEM", { namespace: "FirestoreModule" }) updateItem!: Function;
	@Action("DUPLICATE_ITEM", { namespace: "FirestoreModule" }) duplicateItem!: Function;
	@Action("DELETE_ITEM", { namespace: "FirestoreModule" }) deleteItem!: Function;

	isItemCreatorVisible: boolean = false;
	itemCreatorData: ItemCreatorData = {} as ItemCreatorData;
	isItemCreating: boolean = false;
	imageUploadIdx: number = -1;

	mounted() {
		this.resetItemCreator();
	}

	testNotification() {}

	get getTotalQuantity() {
		return this.stockList.reduce((prev, next) => prev + Number(next.quantity), 0);
	}

	resetItemCreator() {
		this.isItemCreatorVisible = this.isItemCreating = false;
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

	async onImageChange(id: string, idx: number) {
		let imageDOM = this.$refs.image[idx]["files"][0];
		let blobURL = URL.createObjectURL(imageDOM);

		let image = {
			name: imageDOM.name,
			blobURL: blobURL,
			data: await imageToBase64(blobURL),
		};

		this.imageUploadIdx = idx;

		let result = await this.updateItem({ key: "image", id: id, value: image });
		if (result) {
			this.imageUploadIdx = -1;
			this.$store.state.imageUploadProgress = 0;
		}
	}

	async onItemCreatorImageChange() {
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
.slide-enter-active {
	transition: all 0.4s ease;
}
.slide-leave-active {
	transition: all 0.4s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-enter,
.slide-leave-to {
	transform: translateX(-300px);
	opacity: 0;
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

.admin {
	display: flex;
	flex-direction: column;

	height: 100%;

	.actions {
		display: flex;
		justify-content: center;
		align-items: center;

		margin: 30px 0;

		.app-button {
			margin: 0 10px;
		}
	}

	.title {
		margin: 10px 0 10px 0;
		text-align: center;
	}

	.product-info {
		margin-bottom: 20px;
		text-align: center;
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

			border-left: 5px solid rgba(#000, 0.4);
			border-radius: 7px;

			margin-bottom: 10px;
			img {
				display: block;

				margin-right: 30px;

				width: 60px;
				height: 60px;

				border-radius: 50%;
				box-shadow: 0 2px 5px rgba(#000, 0.3);

				cursor: pointer;
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
		position: fixed;
		right: 10px;
		bottom: 10px;

		font-size: 2em;
	}

	.itemCreator-container {
		position: fixed;
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

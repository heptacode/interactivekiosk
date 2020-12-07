import { Module } from "vuex";
import { RootState } from "@/store/index";

import { db, storageRef } from "@/DB";

import firebase from "firebase/app";
import "firebase/firestore";
import { StockItem, ItemCreatorData, ImageItem } from "@/schema";

export interface IFirestoreModule {
	imageUploadProgress: number;
}

const FirestoreModule: Module<IFirestoreModule, RootState> = {
	namespaced: true,
	state: {
		imageUploadProgress: 0,
	},
	actions: {
		async LOG({}, data: { type: string; message: string }): Promise<void> {
			try {
				await db.collection("logs").add({
					timestamp: firebase.firestore.FieldValue.serverTimestamp(),
					platform: process.platform,
					...data,
				});
			} catch (err) {
				console.error(`LOG: Unexpected Error While Logging`);
			}
		},
		async UPLOAD_IMAGE({ state, dispatch }, imageItem: ImageItem): Promise<string> {
			let uploadTask = storageRef.child(`products/${imageItem.name}`).putString(imageItem.data, "base64");
			return new Promise<string>((resolve, reject) => {
				uploadTask.on(
					"state_changed",
					(snapshot) => {
						state.imageUploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					},
					async (err) => {
						await dispatch("LOG", { type: "error", message: `UPLOAD_IMAGE : ${err}` });
					},
					async () => {
						resolve(await uploadTask.snapshot.ref.getDownloadURL());
					}
				);
			});
		},
		// Admin
		async CREATE_ITEM({ dispatch }, data: ItemCreatorData): Promise<boolean> {
			try {
				let imageURL = await dispatch("UPLOAD_IMAGE", data.image);
				return (await db.collection("stock").add({
					...data,
					alias: data.alias ? data.alias.trim().split(",") : [],
					image: imageURL,
				}))
					? true
					: false;
			} catch (err) {
				await dispatch("LOG", { type: "error", message: `CREATE_ITEM : ${err}` });
				return false;
			}
		},
		async UPDATE_ITEM({ dispatch }, data: { id: string; key: string; value: string | string[] | number | ImageItem }): Promise<boolean> {
			try {
				let value = data.value;
				if (data.key === "alias") {
					value = data.value
						.toString()
						.trim()
						.split(",");
				} else if (data.key === "image") {
					value = await dispatch("UPLOAD_IMAGE", data.value);
				}

				await db
					.collection("stock")
					.doc(data.id)
					.update({
						[data.key]: value,
					});
				return true;
			} catch (err) {
				await dispatch("LOG", { type: "error", message: `UPDATE_ITEM : ${err}` });
				return false;
			}
		},
		async DUPLICATE_ITEM({ dispatch }, data: { id: string; itemData: StockItem }): Promise<boolean> {
			try {
				return (await db.collection("stock").add({
					...data["itemData"],
				}))
					? true
					: false;
			} catch (err) {
				await dispatch("LOG", { type: "error", message: `DUPLICATE_ITEM : ${err}` });
				return false;
			}
		},
		async DELETE_ITEM({ dispatch }, id: string): Promise<boolean> {
			try {
				await db
					.collection("stock")
					.doc(id)
					.delete();
				return true;
			} catch (err) {
				await dispatch("LOG", { type: "error", message: `DELETE_ITEM : ${err}` });
				return false;
			}
		},
		async GET_CONFIG({ dispatch }): Promise<any> {
			try {
				let configDocSnapshot = await db
					.collection("config")
					.doc("config")
					.get();
				return configDocSnapshot.data();
			} catch (err) {
				await dispatch("LOG", { type: "error", message: `GET_CONFIG : ${err}` });
				return false;
			}
		},
		async UPDATE_CONFIG({ dispatch }, data: { key: string; value: string | number }): Promise<boolean> {
			try {
				await db
					.collection("settings")
					.doc("settings")
					.update({
						[data.key]: data.value,
					});
				return true;
			} catch (err) {
				await dispatch("LOG", { type: "error", message: `UPDATE_CONFIG : ${err}` });
				return false;
			}
		},
	},
};

export default FirestoreModule;

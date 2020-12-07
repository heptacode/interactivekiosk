import { Module } from "vuex";
import { RootState } from "@/store/index";

import { db, storageRef } from "@/DB";

import firebase from "firebase/app";
import "firebase/firestore";
import { StockItem, ItemCreatorData } from "@/schema";

export interface IFirestoreModule {}

const FirestoreModule: Module<IFirestoreModule, RootState> = {
	namespaced: true,
	actions: {
		async LOG({}, data: { type: string; message: string }): Promise<void> {
			try {
				await db.collection("logs").add({
					timestamp: firebase.firestore.FieldValue.serverTimestamp(),
					platform: process.platform,
					type: data.type,
					message: data.message,
				});
			} catch (err) {
				console.error(`LOG: Unexpected Error While Logging`);
			}
		},
		async CREATE_TRANSACTION({ dispatch }, data: { type: string; data: object; totalPrice: number }): Promise<boolean> {
			try {
				return (await db.collection("transactions").add({
					timestamp: firebase.firestore.FieldValue.serverTimestamp(),
					type: data.type,
					data: data.data,
					totalPrice: data.totalPrice,
				}))
					? true
					: false;
			} catch (err) {
				await dispatch("LOG", { type: "error", message: `트랜잭션 추가 실패 : ${err}` });
				return false;
			}
		},
		// Admin
		async CREATE_ITEM({ dispatch }, data: ItemCreatorData): Promise<boolean> {
			try {
				let uploadTask = storageRef.child(`products/${data.image.name}`).putString(data.image.data, "base64");

				uploadTask.on(
					"state_changed",
					async (err) => {
						await dispatch("LOG", { type: "error", message: `CREATE_ITEM : ${err}` });
					},
					async () => {
						return (await db.collection("stock").add({
							name: data.name,
							alias: data.alias.trim().split(","),
							price: data.price,
							quantity: data.quantity,
							image: await uploadTask.snapshot.ref.getDownloadURL(),
						}))
							? true
							: false;
					}
				);
			} catch (err) {
				await dispatch("LOG", { type: "error", message: `CREATE_ITEM : ${err}` });
				return false;
			}
		},
		async UPDATE_ITEM({ dispatch }, data: { id: string; key: string; value: string | number }): Promise<boolean> {
			try {
				let value =
					data.key === "alias"
						? data.value
								.toString()
								.trim()
								.split(",")
						: data.value;

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
					name: data.itemData.name,
					alias: data.itemData.alias,
					price: data.itemData.price,
					quantity: data.itemData.quantity,
					image: data.itemData.image,
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

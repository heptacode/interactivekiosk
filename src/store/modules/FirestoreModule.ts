import { Module } from "vuex";
import { RootState } from "@/store/index";

import { firestoreAction } from "vuexfire";
import { db } from "@/DB";

import firebase from "firebase/app";
import "firebase/firestore";

db.collection("config")
	.doc("config")
	.onSnapshot(function(doc) {
		var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
		console.log(source, " data: ", doc.data());
	});

export interface IFirestoreModule {}

const FirestoreModule: Module<IFirestoreModule, RootState> = {
	namespaced: true,
	state: {
		stockList: [],
	},
	actions: {
		bindStock: firestoreAction(({ bindFirestoreRef }) => {
			// return the promise returned by `bindFirestoreRef`
			return bindFirestoreRef("stockList", db.collection("stock"));
		}),
		unbindStock: firestoreAction(({ unbindFirestoreRef }) => {
			unbindFirestoreRef("stockList");
		}),
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
		async CREATE_TRANSACTION({}, data: { type: string; data: object; totalPrice: number }): Promise<boolean> {
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
				await this.dispatch("LOG", { type: "error", message: `트랜잭션 추가 실패 : ${err}` });
				return false;
			}
		},
		// Admin
		async CREATE_ITEM({}, data: { name: string; alias: string[]; price: number; quantity: number; image: string }): Promise<boolean> {
			try {
				return (await db.collection("stock").add({
					name: data.name,
					alias: data.alias,
					price: data.price,
					quantity: data.quantity,
					image: data.image,
				}))
					? true
					: false;
			} catch (err) {
				await this.dispatch("LOG", { type: "error", message: `CREATE_ITEM : ${err}` });
				return false;
			}
		},
		async UPDATE_ITEM({}, data: { id: string; key: string; item: string | number }): Promise<boolean> {
			try {
				await db
					.collection("stock")
					.doc(data.id)
					.update({
						[data.key]: data.item?.[data.key],
					});
				return true;
			} catch (err) {
				await this.dispatch("LOG", { type: "error", message: `UPDATE_ITEM : ${err}` });
				return false;
			}
		},
		async DELETE_ITEM({}, data: { id: string }): Promise<boolean> {
			try {
				await db
					.collection("stock")
					.doc(data.id)
					.delete();
				return true;
			} catch (err) {
				await this.dispatch("LOG", { type: "error", message: `DELETE_ITEM : ${err}` });
				return false;
			}
		},
		async GET_CONFIG({}): Promise<any> {
			try {
				let configDocSnapshot = await db
					.collection("config")
					.doc("config")
					.get();
				return configDocSnapshot.data();
			} catch (err) {
				await this.dispatch("LOG", { type: "error", message: `GET_CONFIG : ${err}` });
				return false;
			}
		},
		async UPDATE_CONFIG({}, data: { key: string; value: string | number }): Promise<boolean> {
			try {
				await db
					.collection("settings")
					.doc("settings")
					.update({
						[data.key]: data.value,
					});
				return true;
			} catch (err) {
				await this.dispatch("LOG", { type: "error", message: `UPDATE_CONFIG : ${err}` });
				return false;
			}
		},
	},
};

export default FirestoreModule;

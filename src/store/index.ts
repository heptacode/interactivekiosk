import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import { StockItem } from "@/schema";
import { db } from "@/DB";

import { firestoreAction, vuexfireMutations } from "vuexfire";

import CryptoJS from "crypto-js";
import axios from "axios";

import AudioModule, { IAudioModule } from "./modules/AudioModule";
import FirestoreModule, { IFirestoreModule } from "./modules/FirestoreModule";

const script = require("@/lib/script.json");

Vue.use(Vuex);

export interface RootState {
	isElectron: boolean;
	earphoneDetection: boolean;
	stockList: StockItem[];
	helloLoop: number;
	script: string;
}

const store: StoreOptions<RootState> = {
	state: {
		isElectron: process.env.IS_ELECTRON ? true : false,
		earphoneDetection: false,
		stockList: [],
		helloLoop: 0,
		script: "",
	},
	mutations: {
		activateEarphoneDetection(state) {
			state.earphoneDetection = true;
		},
		stopHelloLoop(state) {
			clearInterval(state.helloLoop);
		},
		...vuexfireMutations,
	},
	actions: {
		bindStock: firestoreAction(({ bindFirestoreRef }) => {
			return bindFirestoreRef("stockList", db.collection("stock").orderBy("name"));
		}),
		unbindStock: firestoreAction(({ unbindFirestoreRef }) => {
			unbindFirestoreRef("stockList");
		}),
		startHelloLoop({ state, dispatch }) {
			state.helloLoop = window.setInterval(() => dispatch("AudioModule/playAudio", { isLocal: true, data: "home/hello" }), 16000);
		},
		async playItems({ state, dispatch }): Promise<boolean> {
			let stockList: string = "";
			state.stockList.forEach((item) => {
				stockList += `${item.name}, `;
			});
			state.script = script.item_list;
			await dispatch("AudioModule/playAudio", { isLocal: true, data: "voiceorder/item_list" });
			state.script = stockList;
			await dispatch("TTS", stockList);
			return true;
		},
		async STT({}, data: Blob): Promise<string> {
			return (
				await axios.post("https://naveropenapi.apigw.ntruss.com/recog/v1/stt", data, {
					params: {
						lang: "Kor",
					},
					headers: {
						"Content-Type": "application/octet-stream",
						"X-NCP-APIGW-API-KEY-ID": process.env.VUE_APP_KEYID,
						"X-NCP-APIGW-API-KEY": process.env.VUE_APP_KEY,
					},
					withCredentials: true,
				})
			).data.text;
		},
		async TTS({ dispatch }, text: string): Promise<any> {
			try {
				let checksum = CryptoJS.MD5(`3134${text}${process.env.VUE_APP_TTSACCOUNT}${process.env.VUE_APP_TTSID}${process.env.VUE_APP_TTSSECRET}`).toString();

				let result: Blob = (
					await axios.get(`http://www.vocalware.com/tts/gen.php?EID=3&LID=13&VID=4&TXT=${text}&ACC=${process.env.VUE_APP_TTSACCOUNT}&API=${process.env.VUE_APP_TTSID}&CS=${checksum}`, {
						responseType: "blob",
						headers: {
							"Content-Type": "audio/mp3",
						},
					})
				).data;

				let url = URL.createObjectURL(result);
				return await dispatch("AudioModule/playAudio", { isLocal: false, data: url });
			} catch (err) {
				console.error(err);
			}
		},
	},
	modules: {
		AudioModule,
		FirestoreModule,
	},
};

export default new Vuex.Store(store);

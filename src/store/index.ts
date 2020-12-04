import Vue from "vue";
import Vuex from "vuex";

import CryptoJS from "crypto-js";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		audio: new Audio() as HTMLAudioElement,
	},
	mutations: {},
	actions: {
		playAudio({ state }, data: { isLocal: boolean; url: string }): Promise<boolean> {
			let audio = state.audio;
			audio.pause();

			let url: string = data.isLocal ? `/assets/sound/${data.url}.mp3` : data.url;
			audio = new Audio(url);

			audio.play();

			return new Promise<boolean>((resolve) => {
				audio.addEventListener("ended", () => {
					URL.revokeObjectURL(url);
					setTimeout(() => resolve(true), 400);
				});
			});
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
		async TTS({}, text: string): Promise<any> {
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
				return await this.dispatch("playAudio", { isLocal: false, url });
			} catch (err) {
				console.error(err);
			}
		},
	},
	modules: {},
});

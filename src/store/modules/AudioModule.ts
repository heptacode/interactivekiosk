import { Module } from "vuex";
import { RootState } from "@/store/index";

export interface IAudioModule {
	audio: HTMLAudioElement;
}

const AudioModule: Module<IAudioModule, RootState> = {
	namespaced: true,
	state: {
		audio: new Audio(),
	},
	actions: {
		playAudio({ state }, data: { isLocal: boolean; url: string }): Promise<boolean> {
			console.log(data);
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
	},
};

export default AudioModule;

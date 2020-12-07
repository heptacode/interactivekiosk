import { Module } from "vuex";
import { RootState } from "@/store/index";

let audio: HTMLAudioElement;

export interface IAudioModule {
	audio: HTMLAudioElement;
}

const AudioModule: Module<IAudioModule, RootState> = {
	namespaced: true,
	mutations: {
		stopAudio(): void {
			if (audio) audio.pause();
		},
	},
	actions: {
		playAudio({}, data: { isLocal: boolean; data: string }): Promise<boolean> {
			if (audio) audio.pause();

			let url: string = data.isLocal ? `/assets/sound/${data.data}.mp3` : data.data;
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

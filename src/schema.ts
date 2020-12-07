import "@types/dom-mediacapture-record";

export interface StockItem {
	id?: string;
	name: string;
	alias?: string[];
	price: number;
	quantity: number;
	image: string;
}

export interface ItemCreatorData {
	name: string;
	alias?: string;
	price: number;
	quantity: number;
	image: ImageItem;
}

export interface ImageItem {
	name: string;
	blobURL: string;
	data: string;
}

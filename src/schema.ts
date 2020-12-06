import "@types/dom-mediacapture-record";

export interface StockItem {
	id: string;
	name: string;
	price: number;
	alias?: string[];
	quantity: number;
	image?: string;
}

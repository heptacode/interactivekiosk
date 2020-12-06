import "@types/dom-mediacapture-record";

export interface StockItem {
	id: string;
	name: string;
	alias?: string[];
	price: number;
	quantity: number;
	image: string;
}

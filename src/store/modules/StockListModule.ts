import { StockItem } from "@/schema";

import { Module } from "vuex";
import { RootState } from "@/store/index";

export interface IStockListModule {
	stockList: StockItem[];
}

const StockListModule: Module<IStockListModule, RootState> = {
	namespaced: true,
	state: {
		stockList: [
			{
				name: "사과",
				alias: ["사과", "사가"],
				price: 1000,
				quantity: 10,
				image: "apple.jpg",
			},
			{
				name: "라면",
				alias: ["라면", "라멘", "나면"],
				price: 500,
				quantity: 10,
				image: "ramen.jpg",
			},
			{
				name: "파스타",
				alias: ["파스타", "스파게티", "스파게리", "수파게티", "파수타"],
				price: 10000,
				quantity: 10,
				image: "pasta.jpg",
			},
			{
				name: "복숭아",
				alias: ["복숭아", "봉숭아", "보숭아", "보숭이", "복숭", "보숭"],
				price: 2000,
				quantity: 10,
				image: "peach.jpg",
			},
			{
				name: "우유",
				alias: ["우유", "우우", "유유", "으유"],
				price: 3500,
				quantity: 10,
				image: "milk.jpg",
			},
		] as StockItem[],
	},
};

export default StockListModule;

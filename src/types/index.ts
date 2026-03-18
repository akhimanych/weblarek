// Товар
export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

// Данные покупателя
export interface IOrder {
	payment: TOrderPayment;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

// Информация о заказе
export interface IOrderInfo {
	id: string;
	total: number;
}

// Ответ с сервера
export interface IGetProductListResponce {
	total: number;
	items: TProductList;
}

export type TOrderPayment = 'online' | 'upon_receipt';
export type TProductList = [IProduct];

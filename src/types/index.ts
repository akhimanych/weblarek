// Товар
export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

// Данные покупателя
export interface IBuyer {
	payment: TOrderPayment;
	address: string;
	email: string;
	phone: string;
}

// Заказ (данные покупателя + итог и список товаров)
export interface IOrder extends IBuyer {
	total: number;
	items: string[];
}

// Информация о заказе
export interface IOrderInfo {
	id: string;
	total: number;
}

// Ответ с сервера с товарами
export interface IGetProductListResponce {
	total: number;
	items: IProduct[];
}

export interface IModelOrder {
	payment: TOrderPayment | null;
	email: string;
	phone: string;
	address: string;
}

export interface IValidationErrors {
	payment?: string;
	address?: string;
	email?: string;
	phone?: string;
}

export type TOrderPayment = 'online' | 'upon_receipt';
export type TProductList = IProduct[];

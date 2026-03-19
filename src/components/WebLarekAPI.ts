import { Api } from './base/api';
import {
	IGetProductListResponce,
	IOrder,
	IOrderInfo,
	TProductList,
} from '../types';

export interface IWebLarekAPI {
	getProductList: () => Promise<TProductList>;
	pushOrder: (order: IOrder) => Promise<IOrderInfo>;
}

export class WebLarekAPI extends Api implements IWebLarekAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductList(): Promise<TProductList> {
		return this.get(`/product`).then(
			(response: IGetProductListResponce) =>
				response.items.map((item) => ({
					...item,
					image: this.cdn + item.image,
				})) as TProductList
		);
	}

	pushOrder(order: IOrder): Promise<IOrderInfo> {
		return this.post(`/order`, order).then(
			(orderInfo: IOrderInfo) => orderInfo
		);
	}
}

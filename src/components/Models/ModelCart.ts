import { IEvents } from "../base/events";
import { IProduct } from "../../types";

export class ModelCart {
    protected items: IProduct[] = [];
    
    constructor(protected events: IEvents) { }

    //добавляет товар в корзину 
    addCart(product: IProduct): void {
        this.items.push(product);
        this.events.emit('cart:changed', this.items);
    }

    //удаляет товар по ID из корзины
    deleteCart(id: string): void {
        this.items = this.items.filter(item => item.id !== id);
        this.events.emit('cart:changed', this.items);
    }

    //возвращает все товары корзины для рендера
    getItems(): IProduct[] {
        return this.items;
    }

    //считает количество товаров в корзине 
    getTotalCount() {
        return this.items.length;
    }

    //вычисляет общую стоимость корзины
    getTotal() {
        return this.items.reduce((sum, item) => sum + +item.price, 0);
    }

    //проверяет наличие товара в корзине
    hasItem(id: string): boolean {
        return this.items.some(item => item.id === id);
    }

    //очищает корзину полностью 
    clearCart() {
        this.items = [];
        this.events.emit('cart:changed', this.items);
    }
}

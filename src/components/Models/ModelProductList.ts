import { IEvents } from "../base/events";
import { IProduct } from "../../types";

export class ModelProductList {
    protected items: IProduct[] = [];
    
    constructor(protected events: IEvents) { }

    //возвращает весь список товаров
    getItems(): IProduct[] {
        return this.items;
    }

    //Загружает товары из API
    setItems(items: IProduct[]): void {
        this.items = items;
        this.events.emit('items:changed', items);
    }

    //находит один товар по ID
    getItemById(id: string): IProduct | undefined {
        return this.items.find(item => item.id === id);
    }
}

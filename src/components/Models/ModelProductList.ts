import { IEvents } from "../base/events";
import { IProduct } from "../../types";

export class ModelProductList {
    protected items: IProduct[] = [];
    protected selectedItem: IProduct | null = null;
    
    constructor(protected events: IEvents) { }

    //возвращает весь список товаров
    getItems(): IProduct[] {
        return this.items;
    }

    //загружает товары из API
    setItems(items: IProduct[]): void {
        this.items = items;
        this.events.emit('items:changed', items);
    }

    //находит один товар по ID
    getItemById(id: string): IProduct | undefined {
        return this.items.find(item => item.id === id);
    }

    //устанавливает текущий выбранный продукт
    setSelectedItem(item: IProduct): void {
        this.selectedItem = item;
        this.events.emit('product:selected', item);
    }

    //возвращает текущий выбранный продукт
    getSelectedItem(): IProduct | null {
        return this.selectedItem;
    }
}

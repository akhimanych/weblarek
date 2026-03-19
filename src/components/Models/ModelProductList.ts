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
    setSelectedItem(id: string): void {
        this.selectedItem = this.getItemById(id) || null;
        this.events.emit('product:selected', this.selectedItem);
    }

    //возвращает текущий выбранный продукт
    getSelectedItem(): IProduct | null {
        return this.selectedItem;
    }
}

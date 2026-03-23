import { ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/events";
import { IProduct } from "../../types";
import { BaseCard } from "./BaseCard";

interface IViewCartProductItem {
    product: IProduct;
    counter: number;
}

export class ViewCartProductItem extends BaseCard {
    protected readonly itemCart: HTMLElement;
    protected _indexElement: HTMLElement;
    protected _buttonElement: HTMLButtonElement;
    protected deleteId: string;

    constructor(container: HTMLElement, protected events: EventEmitter, deleteId: string) {
        super(container);

        this.itemCart = container;
        this.deleteId = deleteId;
        this._indexElement = ensureElement<HTMLElement>('.basket__item-index', this.itemCart);
        this._buttonElement = ensureElement<HTMLButtonElement>('.basket__item-delete', this.itemCart);

        this._buttonElement.addEventListener('click', () => {
            this.events.emit('cart:delete-item', { id: this.deleteId });
        });
    }

    set product(value: IProduct) {
        this.updateTitle(value.title);
        this.updatePrice(value.price);
    }

    set counter(count: number) {
        this._indexElement.textContent = count.toString();
    }
}

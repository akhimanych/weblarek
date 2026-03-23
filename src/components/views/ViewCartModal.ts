import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/components";
import { IEvents } from "../base/events";

export class ViewCartModal extends Component<{}> {
    protected _orderButton: HTMLButtonElement;
    protected _totalPrice: HTMLElement;
    protected _listElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.initElements();
    }

    protected initElements() {
        this._orderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        this._totalPrice = ensureElement<HTMLElement>('.basket__price', this.container);
        this._listElement = ensureElement<HTMLElement>('.basket__list', this.container);

        this._orderButton.addEventListener('click', () => {
            this.events.emit('cart:order');
        });
    }

    /**
     * Обновляет список товаров в корзине.
     */
    set products(items: HTMLElement[]) {
        this._listElement.replaceChildren(...items);

        this._orderButton.toggleAttribute('disabled', !items.length);
        this._orderButton.classList.toggle('disabled', !items.length);
    }

    set total(value: number) {
        this._totalPrice.textContent =
            (typeof value === 'number' && !isNaN(value) ? value : 0) + ' синапсов';
    }
}

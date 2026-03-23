import { ensureElement } from "../../utils/utils";
import { Component } from "../base/components";
import { IProduct } from "../../types";

export abstract class BaseCard extends Component<IProduct> {
    protected _titleElement: HTMLElement;
    protected _priceElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this._titleElement = ensureElement<HTMLElement>('.card__title', container);
        this._priceElement = ensureElement<HTMLElement>('.card__price', container);
    }

    protected updateTitle(title: string): void {
        this._titleElement.textContent = title;
    }

    protected updatePrice(price: number | undefined): void {
        this._priceElement.textContent = price ? `${price} синапсов` : 'Бесплатно';
    }
}

import { ensureElement } from '../../utils/utils';
import { Component } from '../base/components';
import { IProduct } from '../../types';
import { IEvents } from '../base/events';

interface IViewProductModal {
    image: string;
    category: string;
    title: string;
    description: string;
    price: number;
    product: IProduct;
    selectedCart: boolean;
}

export class ViewProductModal extends Component<IViewProductModal> {
    protected _imageElement: HTMLImageElement;
    protected _categoryElement: HTMLElement;
    protected _titleElement: HTMLElement;
    protected _descriptionElement: HTMLElement;
    protected _priceElement: HTMLElement;
    protected _buttonElement: HTMLButtonElement;
    protected _product: IProduct;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.initElements();
    }

    protected initElements(): void {
        this._titleElement = ensureElement<HTMLElement>('.card__title', this.container);
        this._descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
        this._priceElement = ensureElement<HTMLElement>('.card__price', this.container);
        this._imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this._categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
        this._buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

        this._buttonElement.addEventListener('click', () => {
            this.events.emit('cart:toggle', this._product);
        });
    }

    set product(value: IProduct) {
        this._product = value;

        // Заполняем данные
        this._titleElement.textContent = value.title;
        this._descriptionElement.textContent = value.description;
        this._imageElement.src = value.image;
        this._imageElement.alt = value.title;
        this._priceElement.textContent = value.price ? `${value.price} синапсов` : 'Бесценно';

        // Категория
        this._categoryElement.textContent = value.category;
        this._categoryElement.classList.remove(
            'card__category_soft', 'card__category_hard', 'card__category_other',
            'card__category_additional', 'card__category_button'
        );
        const categoryClass = {
            'софт-скил': 'card__category_soft',
            'хард-скил': 'card__category_hard',
            'другое': 'card__category_other',
            'дополнительное': 'card__category_additional',
            'кнопка': 'card__category_button'
        }[value.category] || '';
        if (categoryClass) this._categoryElement.classList.add(categoryClass);

        // Кнопка по цене
        if (value.price === null) {
            this._buttonElement.classList.add('disabled');
            this._buttonElement.setAttribute('disabled', 'true');
            this._buttonElement.textContent = 'Недоступно';
        } else {
            this._buttonElement.classList.remove('disabled');
            this._buttonElement.removeAttribute('disabled');
        }
    }

    set selectedCart(value: boolean) {
        if (this._product?.price === null) return;
        
        this._buttonElement.textContent = value ? 'Убрать из корзины' : 'Купить';
    }
}

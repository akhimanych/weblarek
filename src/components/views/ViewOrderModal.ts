import { EventEmitter } from '../base/events';
import { Component } from '../base/components';
import { ensureElement } from '../../utils/utils';
import { TOrderPayment } from '../../types';

interface IViewOrderModal {
    form: HTMLFormElement;
}

export class ViewOrderModal extends Component<IViewOrderModal> {
    protected _order: HTMLFormElement;
    protected _inputAddress: HTMLInputElement;
    protected _cardButton: HTMLButtonElement;
    protected _cashButton: HTMLButtonElement;
    protected _submitButton: HTMLButtonElement;

    constructor(container: HTMLTemplateElement, protected events: EventEmitter) {
        super(container);

        this._order = ensureElement<HTMLFormElement>('.order', container);
        this._cardButton = ensureElement<HTMLButtonElement>('[name="card"]', container);
        this._cashButton = ensureElement<HTMLButtonElement>('[name="cash"]', container);
        this._inputAddress = ensureElement<HTMLInputElement>('[name="address"]', container);
        this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);

        this._cardButton.addEventListener('click', () => {
            this.events.emit('inputUser:changed', {
                field: 'payment',
                value: 'card' as TOrderPayment,
            });
        });

        this._cashButton.addEventListener('click', () => {
            this.events.emit('inputUser:changed', {
                field: 'payment',
                value: 'cash' as TOrderPayment,
            });
        });

        this._inputAddress.addEventListener('input', () => {
            this.events.emit('inputUser:changed', {
                field: 'address',
                value: this._inputAddress.value,
            });
        });

        this._submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.events.emit('order:proceed');
        });

        this.events.on('order:valid', () => {
            this._submitButton.disabled = false;
            this._submitButton.classList.remove('button_disabled');
        });

        this.events.on('order:invalid', () => {
            this._submitButton.disabled = true;
            this._submitButton.classList.add('button_disabled');
        });

        this.events.on('order.payment:changed', ({ payment }: { payment: TOrderPayment }) => {
            this.setPaymentMethod(payment);
        });

        this.events.on('order.address:changed', ({ address }: { address: string }) => {
            this._inputAddress.value = address;
        });
    }

setPaymentMethod(method: TOrderPayment): void {
    const paymentMethod = method as 'card' | 'cash';
    this._cardButton.classList.toggle('button_alt-active', paymentMethod === 'card');
    this._cashButton.classList.toggle('button_alt-active', paymentMethod === 'cash');
}
}

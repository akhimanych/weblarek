import { EventEmitter } from '../base/events';
import { Component } from '../base/components';
import { ensureElement } from '../../utils/utils';
import { TOrderPayment } from '../../types';
import { IValidationErrors } from '../../types';

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
    }

    setFormValid(state: boolean): void {
        this._submitButton.disabled = !state;
        this._submitButton.classList.toggle('button_disabled', !state);
    }

    showErrors(errors: IValidationErrors): void {
        if (errors.address) {
            this._inputAddress.classList.add('input_error');
            this._inputAddress.title = errors.address;
        } else {
            this._inputAddress.classList.remove('input_error');
            this._inputAddress.title = '';
        }
        if (errors.payment) {
            this._cardButton.title = errors.payment;
            this._cashButton.title = errors.payment;
        } else {
            this._cardButton.title = '';
            this._cashButton.title = '';
        }
    }

    clearErrors(): void {
        this._inputAddress.classList.remove('input_error');
        this._inputAddress.title = '';
        this._cardButton.title = '';
        this._cashButton.title = '';
    }

    setPaymentMethod(method: TOrderPayment): void {
        const paymentMethod = method as 'card' | 'cash';
        this._cardButton.classList.toggle('button_alt-active', paymentMethod === 'card');
        this._cashButton.classList.toggle('button_alt-active', paymentMethod === 'cash');
    }

    setAddress(address: string): void {
        this._inputAddress.value = address;
    }
}

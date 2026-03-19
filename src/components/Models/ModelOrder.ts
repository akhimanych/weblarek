import { TOrderPayment, IModelOrder, IValidationErrors } from "../../types";
import { EventEmitter } from "../base/events";

//хранит объект заказа + события для уведомлений
export class ModelOrder {
    protected _order: IModelOrder;
    protected events: EventEmitter;

    constructor(events: EventEmitter) {
        this._order = {
            payment: null,
            address: '',
            email: '',
            phone: ''
        };
        this.events = events;
    }

    setPayment(method: TOrderPayment): void {
        this._order.payment = method;
        this.events.emit('order.payment:changed', { payment: method });
    }

    setAddress(address: string): void {
        this._order.address = address;
        this.events.emit('order.address:changed', { address });
    }

    setEmail(email: string): void {
        this._order.email = email;
        this.events.emit('order.email:changed', { email });
    }

    setPhone(phone: string): void {
        this._order.phone = phone;
        this.events.emit('order.phone:changed', { phone });
    }

    getOrder(): IModelOrder {
        return this._order;
    }

    validateOrder(): IValidationErrors {
        const errors: IValidationErrors = {};

        if (!this._order.payment) {
            errors.payment = 'Способ оплаты обязателен';
        }

        if (!this._order.address.trim()) {
            errors.address = 'Адрес обязателен';
        }

        if (!this._order.email.trim()) {
            errors.email = 'Email обязателен';
        }

        if (!this._order.phone.trim()) {
            errors.phone = 'Телефон обязателен';
        }

        return errors;
    }

    clearOrder(): void {
        this._order = {
            payment: null,
            address: '',
            email: '',
            phone: ''
        };
    }
}

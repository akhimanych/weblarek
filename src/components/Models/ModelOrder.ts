import { TOrderPayment } from "../../types";
import { EventEmitter } from "../base/events";

export interface IModelOrder {
    payment: TOrderPayment,
    email: string,
    phone: string,
    address: string
}

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

    //устанавливает способ оплаты
    setPayment(method: TOrderPayment): void {
        this._order.payment = method;
        this.events.emit('order.payment:changed', { payment: method });
    }

    //сохраняет адрес доставки 
    setAddress(address: string): void {
        this._order.address = address;
        this.events.emit('order.address:changed', { address });
    }

    //сохраняет email 
    setEmail(email: string): void {
        this._order.email = email;
        this.events.emit('order.email:changed', { email });
    }

    //сохраняет телефон 
    setPhone(phone: string): void {
        this._order.phone = phone;
        this.events.emit('order.phone:changed', { phone });
    }

    //массово обновляет любые поля 
    setOrder(data: Partial<IModelOrder>): void {
        this._order = {
            ...this._order,
            ...data
        };
        this.events.emit('order:changed', this._order);
    }

    //возвращает полный объект заказа
    getOrder(): IModelOrder {
        return this._order;
    }

    //проверяет заполнены ли все обязательные поля
    validateOrder(): boolean {
        return !!this._order.payment &&
            this._order.address.trim().length > 0 &&
            this._order.email.trim().length > 0 &&
            this._order.phone.trim().length > 0;
    }

    //проверяет заполнены ли все обязательные поля
    clearOrder(): void {
        this._order = {
            payment: null,
            address: '',
            email: '',
            phone: ''
        };
    }
}
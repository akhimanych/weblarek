import { TOrderPayment, IModelOrder, IValidationErrors } from '../../types';
import { EventEmitter } from '../base/events';

export class ModelOrder {
	protected _order: IModelOrder;
	protected events: EventEmitter;

	constructor(events: EventEmitter) {
		this._order = {
			payment: null,
			address: '',
			email: '',
			phone: '',
		};
		this.events = events;
	}

	setPayment(method: TOrderPayment): void {
		this._order.payment = method;
		this.events.emit('order.payment:changed', { payment: method });
		this.validate('order');
		this.validateFullOrder();
	}

	setAddress(address: string): void {
		this._order.address = address;
		this.events.emit('order.address:changed', { address });
		this.validate('order');
		this.validateFullOrder();
	}

	setEmail(email: string): void {
		this._order.email = email;
		this.events.emit('order.email:changed', { email });
		this.validate('contact');
		this.validateFullOrder();
	}

	setPhone(phone: string): void {
		this._order.phone = phone;
		this.events.emit('order.phone:changed', { phone });
		this.validate('contact');
		this.validateFullOrder();
	}

	private validate(type: 'order' | 'contact'): void {
		const errors =
			type === 'order' ? this.validateOrderForm() : this.validateContactForm();
		const isValid = Object.keys(errors).length === 0;
		this.events.emit(isValid ? 'order:valid' : 'order:invalid', errors);
	}

	private validateFullOrder(): void {
		const orderErrors = this.validateOrderForm();
		const contactErrors = this.validateContactForm();
		const allErrors: IValidationErrors = { ...orderErrors, ...contactErrors };
		const isFullValid = Object.keys(allErrors).length === 0;
		this.events.emit(
			isFullValid ? 'order:fullValid' : 'order:fullInvalid',
			allErrors
		);
	}

	private validateOrderForm(): IValidationErrors {
		const errors: IValidationErrors = {};
		if (!this._order.payment) {
			errors.payment = 'Способ оплаты обязателен';
		}
		if (!this._order.address.trim()) {
			errors.address = 'Адрес обязателен';
		}
		return errors;
	}

	private validateContactForm(): IValidationErrors {
		const errors: IValidationErrors = {};
		if (!this._order.email.trim()) {
			errors.email = 'Email обязателен';
		}
		if (!this._order.phone.trim()) {
			errors.phone = 'Телефон обязателен';
		}
		return errors;
	}

	getOrder(): IModelOrder {
		return { ...this._order };
	}

	clearOrder(): void {
		this._order = {
			payment: null,
			address: '',
			email: '',
			phone: '',
		};
		this.events.emit('order:cleared');
		this.events.emit('order:fullInvalid', {});
	}
}

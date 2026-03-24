import { EventEmitter } from '../base/events';
import { Component } from '../base/components';
import { ensureElement } from '../../utils/utils';
import { IValidationErrors } from '../../types';

interface IViewOrderContactModal {
	form: HTMLFormElement;
}

export class ViewOrderContactModal extends Component<IViewOrderContactModal> {
	protected _inputEmail: HTMLInputElement;
	protected _inputPhone: HTMLInputElement;
	protected _submitButton: HTMLButtonElement;

	constructor(container: HTMLTemplateElement, protected events: EventEmitter) {
		super(container);

		this._inputEmail = ensureElement<HTMLInputElement>(
			'[name="email"]',
			container
		);
		this._inputPhone = ensureElement<HTMLInputElement>(
			'[name="phone"]',
			container
		);
		this._submitButton = ensureElement<HTMLButtonElement>(
			'button[type="submit"]',
			container
		);

		this._inputEmail.addEventListener('input', () => {
			this.events.emit('inputUser:changed', {
				field: 'email',
				value: this._inputEmail.value,
			});
		});

		this._inputPhone.addEventListener('input', () => {
			this.events.emit('inputUser:changed', {
				field: 'phone',
				value: this._inputPhone.value,
			});
		});

		this._submitButton.addEventListener('click', (e) => {
			e.preventDefault();
			this.events.emit('finish:click');
		});
	}

	setFormValid(state: boolean): void {
		this._submitButton.disabled = !state;
		this._submitButton.classList.toggle('button_disabled', !state);
	}

	showErrors(errors: IValidationErrors): void {
		if (errors.email) {
			this._inputEmail.classList.add('input_error');
			this._inputEmail.title = errors.email;
		} else {
			this._inputEmail.classList.remove('input_error');
			this._inputEmail.title = '';
		}
		if (errors.phone) {
			this._inputPhone.classList.add('input_error');
			this._inputPhone.title = errors.phone;
		} else {
			this._inputPhone.classList.remove('input_error');
			this._inputPhone.title = '';
		}
	}

	clearErrors(): void {
		this._inputEmail.classList.remove('input_error');
		this._inputPhone.classList.remove('input_error');
		this._inputEmail.title = '';
		this._inputPhone.title = '';
	}

	setLoading(state: boolean): void {
		if (state) {
			this._submitButton.textContent = 'Пожалуйста, ожидайте...';
			this._submitButton.disabled = true;
		} else {
			this._submitButton.textContent = 'Оплатить';
		}
	}

	setEmail(email: string): void {
		this._inputEmail.value = email;
	}

	setPhone(phone: string): void {
		this._inputPhone.value = phone;
	}
}

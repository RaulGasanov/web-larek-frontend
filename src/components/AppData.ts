import { Model } from './base/Model';
import {
	IProductItem,
	IOrder,
	IAppState,
	FormErrors,
	IDelivery,
	IContact,
} from '../types';

export interface CatalogChangeEvent {
	products: IProductItem[];
}

export class AppState extends Model<IAppState> {
	catalog: IProductItem[];
	basket: IProductItem[] = [];
	order: IOrder = {
		total: 0,
		items: [],
		phone: '',
		email: '',
		payment: '',
		address: '',
	};
	
	orderError: FormErrors = {};
	preview: string | null;

	addBasket(product: IProductItem) {
		this.basket.push(product);
		this.updateBasket();
	}

	removeBasket(product: IProductItem) {
		this.basket = this.basket.filter((item) => item.id !== product.id);
		this.updateBasket();
	}

	clearBasket() {
		this.basket = [];
		this.updateBasket();
	}

	updateBasket() {
		this.events.emit('catalog:change', {
			products: this.basket,
		});
		this.events.emit('basket:change', {
			products: this.basket,
		});
	}

	getTotal(): number {
		return this.basket.reduce((acc, item) => acc + item.price, 0);
	}

	setCatalog(products: IProductItem[]) {
		this.catalog = products;
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	setOrderField(field: keyof IDelivery, value: string) {
		this.order[field] = value;
		if (this.validateOrder()) {
		}
	}

	setContactField(field: keyof IContact, value: string) {
		this.order[field] = value;

		if (this.validateContact()) {
		}
	}

	validateOrder() {
		const errors: typeof this.orderError = {};
		if (!this.order.payment) {
			errors.payment = 'Необходимо указать cпособ оплаты';
		}
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес доставки';
		}
		this.orderError = errors;
		this.events.emit('orderformErrors:change', this.orderError);
		return Object.keys(errors).length === 0;
	}

	validateContact() {
		const errors: typeof this.orderError = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.orderError = errors;
		this.events.emit('contactsformErrors:change', this.orderError);
		return Object.keys(errors).length === 0;
	}

	setPreview(item: IProductItem) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	orderReset() {
		this.order.address = '';
		this.order.payment = '';
	}

	contactReset() {
		this.order.email = '';
		this.order.phone = '';
	}
}

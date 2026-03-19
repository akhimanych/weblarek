import './scss/styles.scss';
import { IOrder, IProduct, TOrderPayment } from './types/index';
import { EventEmitter } from './components/base/events';
import { WebLarekAPI } from './components/WebLarekAPI';
import { CDN_URL, API_URL } from './utils/constants';
import { ModelProductList } from './components/Models/ModelProductList';
import { ModelCart } from './components/Models/ModelCart';
import { ModelOrder } from './components/Models/ModelOrder';

// Экземпляры
const events = new EventEmitter();
const productList = new ModelProductList(events);
const modelCart = new ModelCart(events);
const modelOrder = new ModelOrder(events);
const api = new WebLarekAPI(CDN_URL, API_URL);

// Тестовые данные
const testProduct: IProduct = {
	id: 'test1',
	title: 'Тестовый товар',
	description: 'Тест',
	image: `${CDN_URL}/test.jpg`,
	category: 'other',
	price: 1000,
};

// ===== ТЕСТЫ МОДЕЛЕЙ =====
// ModelProductList
console.log(' ModelProductList: изначально', productList.getItems());
productList.setItems([testProduct]);
console.log(' ModelProductList: после setItems', productList.getItems());
console.log(
	'🔍 ModelProductList: getItemById',
	productList.getItemById('test1')
);

// ModelCart
console.log(
	' ModelCart: изначально',
	modelCart.getItems(),
	'сумма:',
	modelCart.getTotal()
);
modelCart.addCart(testProduct);
console.log(
	' ModelCart: после add',
	modelCart.getItems(),
	'сумма:',
	modelCart.getTotal(),
	'has:',
	modelCart.hasItem('test1')
);
modelCart.deleteCart('test1');
console.log(' ModelCart: после delete', modelCart.getItems());
modelCart.clearCart();
console.log(' ModelCart: после clear', modelCart.getItems());

// ModelOrder
modelOrder.setEmail('test@test.ru');
modelOrder.setPhone('+79991234567');
modelOrder.setAddress('ул. Тест, 1');
modelOrder.setPayment('upon_receipt');
console.log(' ModelOrder: заполнен', modelOrder.getOrder());
modelOrder.clearOrder();
console.log(' ModelOrder: очищен', modelOrder.getOrder());

// ===== ТЕСТЫ ВАЛИДАЦИИ ModelOrder (строка 65) =====
console.log('ModelOrder: валидация пустого', modelOrder.validateOrder()); // false

// Полностью валидный
modelOrder.setEmail('test@test.ru');
modelOrder.setPhone('+79991234567');
modelOrder.setAddress('ул. Тест, 1');
modelOrder.setPayment('upon_receipt');
console.log('ModelOrder: валидация полного', modelOrder.validateOrder()); // true

modelOrder.clearOrder();
console.log('ModelOrder: после clear валидация', modelOrder.validateOrder()); // false

// ===== АПИ =====
console.log(' Запрос к API...');
api
	.getProductList()
	.then((items) => {
		console.log(' API вернул:', items.length, 'товаров');
		productList.setItems(items);
		console.log(
			' Сохранено в модель:',
			productList.getItems().length,
			'товаров'
		);
	})
	.catch((err) => console.error(' API ошибка:', err));

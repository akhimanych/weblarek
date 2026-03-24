import './scss/styles.scss';
import { IOrder, IProduct, TOrderPayment } from './types/index';
import { EventEmitter } from './components/base/events';
import { WebLarekAPI } from './components/WebLarekAPI';
import { cloneTemplate, ensureElement } from './utils/utils';
import { CDN_URL, API_URL } from './utils/constants';
import { ModelProductList } from './components/Models/ModelProductList';
import { ModelCart } from './components/Models/ModelCart';
import { ModelOrder } from './components/Models/ModelOrder';
import { ViewPage } from './components/views/ViewPage';
import { ViewProductItem } from './components/views/ViewProductItem';
import { ViewCartProductItem } from './components/views/ViewCartProductItem';
import { ViewModal } from './components/views/ViewModal';
import { ViewProductModal } from './components/views/ViewProductModal';
import { ViewCartModal } from './components/views/ViewCartModal';
import { ViewOrderModal } from './components/views/ViewOrderModal';
import { ViewOrderContactModal } from './components/views/ViewOrderContactModal';
import { ViewSuccessModal } from './components/views/ViewSuccessModal';
import { IValidationErrors } from './types/index';

// Экземпляры моделей
const events = new EventEmitter();
const productList = new ModelProductList(events);
const modelCart = new ModelCart(events);
const modelOrder = new ModelOrder(events);
const api = new WebLarekAPI(CDN_URL, API_URL);

// Экземпляры представлений
const page = new ViewPage(ensureElement<HTMLElement>('.page'), events);
const itemTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const previewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const modal = new ViewModal(ensureElement<HTMLElement>('.modal'));
const productModal = new ViewProductModal(cloneTemplate(previewTemplate), events);
const cartTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const cartModal = new ViewCartModal(cloneTemplate(cartTemplate), events);
const cartItemsTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const formTemplate = document.querySelector('#order') as HTMLTemplateElement;
const formOrder = new ViewOrderModal(cloneTemplate(formTemplate), events);
const formContactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const formContacts = new ViewOrderContactModal(cloneTemplate(formContactsTemplate), events);
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;
const successModal = new ViewSuccessModal(cloneTemplate(successTemplate), events);

function getCartProductList(): HTMLElement[] {
    const items = modelCart.getItems();
    return items.map((item, index) => {
        const cartItem = new ViewCartProductItem(cloneTemplate(cartItemsTemplate), events, item.id);
        cartItem.product = item;
        cartItem.counter = index + 1;
        return cartItem.render();
    });
}

function updateCartView() {
    cartModal.render({
        products: getCartProductList(),
        total: modelCart.getTotal(),
    });
    page.render({
        counter: modelCart.getTotalCount(),
    });
}

// Получение продуктов с сервера
api.getProductList()
    .then((items) => {
        productList.setItems(items);
    })
    .catch((err) => {
        console.error('Ошибка:', err);
    });

// Обработчики событий (существующие)
events.on('items:changed', () => {
    const itemsHTMLArray = productList.getItems().map((item) =>
        new ViewProductItem(cloneTemplate(itemTemplate), events).render({
            product: item,
        })
    );
    page.render({
        catalog: itemsHTMLArray,
    });
});

events.on('cart:changed', () => {
    updateCartView();
});

events.on('item:click', ({ id }: { id: string }) => {
    const productData = productList.getItemById(id);
    if (!productData) return;
    const idElement = modelCart.hasItem(id);
    const productElement = productModal.render({
        product: productData,
        selectedCart: idElement,
    });
    modal.open(productElement);
});

events.on('cart:add-item', (product: IProduct) => {
    modelCart.addCart(product);
});

events.on('cart:open', () => {
    modal.open(cartModal.render());
});

events.on('cart:delete-item', ({ id }: { id: string }) => {
    modelCart.deleteCart(id);
});

events.on('cart:order', () => {
    modal.render({
        content: formOrder.render(),  // Адрес + оплата
    });
});

events.on('inputUser:changed', ({ field, value }: { field: string; value: string }) => {
    switch (field) {
        case 'email':
            return modelOrder.setEmail(value);
        case 'phone':
            return modelOrder.setPhone(value);
        case 'address':
            return modelOrder.setAddress(value);
        case 'payment':
            return modelOrder.setPayment(value as TOrderPayment);
        default:
            return 'Неизвестный тип поля';
    }
});

events.on('order:proceed', () => {
    modal.render({
        content: formContacts.render(),  // Контакты
    });
});

events.on('order:valid', () => {
    formOrder.setFormValid(true);
});

events.on('order:invalid', (errors: IValidationErrors) => {
    formOrder.setFormValid(false);
    formOrder.showErrors(errors);
});

events.on('order:fullValid', () => {
    formContacts.setFormValid(true);
    formContacts.clearErrors();
});

events.on('order:fullInvalid', (errors: IValidationErrors) => {
    formContacts.setFormValid(false);
    formContacts.showErrors(errors);
});

events.on('order.payment:changed', ({ payment }: { payment: TOrderPayment }) => {
    formOrder.setPaymentMethod(payment);
});

events.on('order.address:changed', ({ address }: { address: string }) => {
    formOrder.setAddress(address);
});

events.on('order.email:changed', ({ email }: { email: string }) => {
    formContacts.setEmail(email);
});

events.on('order.phone:changed', ({ phone }: { phone: string }) => {
    formContacts.setPhone(phone);
});

events.on('finish:click', () => {
    const order = {
        ...modelOrder.getOrder(),
        items: modelCart.getItems().map((item) => item.id),
        total: modelCart.getTotal(),
    } as IOrder;
    
    formContacts.setLoading(true);
    
    api
        .pushOrder(order)
        .then((data) => {
            modelCart.clearCart();
            modelOrder.clearOrder();
            modal.render({
                content: successModal.render({
                    totalPrice: data.total,
                }),
            });
        })
        .catch((err) => {
            console.error('Ошибка:', err);
        })
        .then(() => {
            formContacts.setLoading(false);
        });
});

events.on('closes:click', () => {
    modal.close();
});

events.on('cart:toggle', (product: IProduct) => {
    const inCart = modelCart.hasItem(product.id);
    if (inCart) {
        modelCart.deleteCart(product.id);
    } else {
        modelCart.addCart(product);
    }
    productModal.selectedCart = !inCart;
});

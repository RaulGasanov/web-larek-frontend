# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss src/common.blocks — файлы стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура проекта Web-Larek (V -> P -> M -> P -> V )

Код приложения разделен на слои согласно парадигме mvp:

- слой представления, отвечает за отображение данных на странице
- слой данных, отвечает за хранение изменение данных
- презентер, отвечает за связь представления и данных

### Базовый код

#### Класс API

Содержит себе базовую логику отправки запросов. В конструктор передаётся базовый адрес сервера и опциональный объект с загаловками запросов. Методы:

- get - выполняет Get запрос на переданный в параметрах эндпоинт и возвращает промис с объектом, который ответил сервер
- post - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданый как параметр при вызове метода. По умолчанию выполняется POST запрос, но метод запрос может быть перед определённым заданием 3-его параметра при вызове.

#### Класс EvenEmmiter

Брокер событий позволяет отправлять события и подписываться на событие, происходящие в системе. Класс используются в призентере для обработки событий и слоях приложения для генерации событий.

##### Основные методы реализуемые классом описаны интерфейсом IEven.

- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие
- `off` — убирает события
- `onAll` — подписывает на все события
- `ofAll` — сбрасывает все обработчики событий

#### Класс Component<T>

Абстрактный класс компонентов представления (Наследуется всеми классами представления View). Предназначен для создания компонентов пользовательского интерфейса.

##### Свойства Component<T>

```
readonly: HTMLElement — корневой DOM-элемент
```

##### Методы Component<T>

```
toggleClass(element: HTMLElement, class: string) - переключение класса;
setText(element: HTMLElement, value: string) — установление текстового содержимого;
setDisabled(element: HTMLElement, state: boolean) — изменение статуса блокировки;
protected setHidden(element: HTMLElement) — скрытие элемента;
setVisible(element: HTMLElement) — показ элемента;
setImage(element: HTMLElement, src: string, alt?: string) — установить изображение с альтернативным текстом;
render(data?: any) — отвечает за рендер переданных элементов
```

#### Класс Model<T>

Абстрактный класс для создания модельных данных.

##### Свойства Model<T>

protected readonly component: HTMLElement — корневой DOM-элемент
protected readonly component: HTMLElement — корневой DOM-элемент

##### Конструктор Model<T>

(data:Partial, events: IEvenets) — принимает начальный данные для модели и объект событий для уведомления об изменениях в модели.

##### Методы Model<T>

emitChanges(event: string, payload?: object) — запускает событие с переданным названием и данными, уведомляя подписчиков в изменении модели

#### Класс Form<T>

класс для создания форм наследуется от компонента <IFormState>

##### Свойства Form<T>

protected _submit: HTMLButtonElement;
protected _errors: HTMLElement;

##### Конструктор Form<T>

constructor(protected container: HTMLFormElement, protected events: IEvents) — принимает начальный данные для формы и объект событий для уведомления об изменениях в формы.

##### Методы Form<T>
protected onInputChange(field: keyof T, value: string) обработчик событий ввода, который генерирует события изменения /  для каждого поля в форме
set valid(value: boolean) - валидация форм
set errors(value: string) - ошибки 
render(state: Partial<T> & IFormState) — отвечает за рендер переданных элементов

### MODEL

#### Класс AppState extends Model<IAppState>

Класс отражающий полный функционал приложения наследуется от модели

##### Свойства

catalog: IProductItem[] - коллукция товаров
basket: IProductItem[] = [] - коллекция товаров в корзине
order: IOrder = {
total: 0,
items: [],
phone: '',
email: '',
payment: '',
address: '',
} - данные для оформления заказа
orderError: FormErrors = {} - ошибка
preview: string | null - отображение товара по id

##### Методы AppState

```
addBasket(product: IProductItem) - добавление товара в корзину
removeBasket(product: IProductItem) - удаление товара в корзину
clearBasket() - очистка корзины при сбросе формы
updateBasket() - обновление корзины товаров
getTotal(): number - подсчет общей суммы
setCatalog(products: IProductItem[]) - установка каталога товаров
setOrderField(field: keyof IDelivery, value: string) - установка данных способо оплаты и адресса при успешной валидации
setContactField(field: keyof IContact, value: string) - установка данных контактов при успешной валидации
validateOrder() - валидация полей со способом оплаты
validateContact() - валидация полей контактов
setPreview(item: IProductItem) - показ товаров
orderReset(): void - очистка полей формы
contactReset(): void - очистка полей формы
```

### Список событий в приложении

- `'items:changed'` — изменение товара
- `'card:select'` — выбор товара
- `'card:toBasket'` — товар выбран в корзину
- `'basket:add'` — добавление товара
- `'basket:remove'` — удаление товара
- `'basket:change'` — изменение корзины
- `'basket:open'` — открытие корзины
- `'order:open'` — открытие формы с выбором оплаты
- `'order:submit'` — открытие формы с контактами
- `'formErrors:change'` — изменение
- `'order:reset`, `contacts:reset'` — сброс полей формы
- `'modal:open'` — открытие модалки
- `'modal:close'` — закрытие модалки
- `'contacts:submit'` — отправка формы

### Сервисный класс WebLarekApi

#### Класс WebLarekApi

Класс реализует взаимодействие с бэкендом

##### Свойства WebLarekApi

##### Конструктор

```
 constructor(cdn: string, baseUrl: string, options?: RequestInit) - установка данных с помощью CDN_URL, API_URL
```

##### Методы WebLarekApi

```
 getProductList(): Promise<IProductItem[]> - Получение списка продуктов с сервера
 order(order: IForm): Promise<IFormResponse> - Отправка обработанных данных с помощью форм и корзины заказа
```

### VIEW (классы слоя представления, наследники класса Component<T>)

#### Класс Card

Класс для отображения и управления карточками товара. \
 `class Card extends Component<ICard>`

##### Свойства Card

```
protected _id?: HTMLElement - индивидуальный идентификатор карточки
protected _description?: HTMLElement - описание карточки товара
protected _image?: HTMLImageElement - картинка товара
protected _title: HTMLElement - название карточки товара
protected _category?: HTMLElement - категория карточки товара
protected _price: HTMLElement - цена товара
protected _button?: HTMLButtonElement - кнопка добавления
protected _buttonTitle: string - текст кнопки
```

##### Конструктор Card

constructor(container: HTMLElement, actions: ICardActions)

##### Методы Card

```
set id(value: string) / get id(): string - управление индивидуальный идентификатор карточки для добавления в корзину
set title(value: string) / get title(): string - управление названия карточки товара
set image(value: string) - установка картинки товара
set description(value: string) - установка описания карточки товара
set category(value: string) / get category(): string управление категорией карточки товара
disableButton(value: number | null) - проверяет на бесценный товар
set price(value: number) / get price(): number - управляет ценой
set button(value: string) - установка текста кнопки
```
#### Класс Basket
класс Basket компонент корзины нужен для отображения товаров и удаления их из корзины
##### Свойства Basket

```
protected _list: HTMLElement - коллекция товаров в корзине
protected _price: HTMLElement - тотал цена
protected _button: HTMLButtonElement - кнопка отправки
```

##### Конструктор Basket
export class Basket extends Component<IBasketView> 
constructor(container: HTMLElement, actions: ICardActions)

##### Методы Basket

```
set items(items: HTMLElement[])
set selected(items: string[])
set priceTotal(price: number)
```
#### Класс Order

Класс наследуется от класса IForm (который в свою очередь нужен для обработки ошибок) и предоставляет методы для установки значений телефона и \
 электронной почты , а так жеадреса и выбора оплаты в контейнер.

##### Свойства Order

```
protected _cash: HTMLButtonElement - кнопка оплаты наличными
protected _card: HTMLButtonElement - кнопка оплаты картой
```

##### Конструктор Order

constructor(container: HTMLFormElement, events: IEvents)

##### Методы Order

```
set adress - устанавливает адрес
set payment - устанвливает значение `Онлайн` и `При получении`
```

#### Класс Contact

Класс наследуется от класса IForm (который в свою очередь нужен для обработки ошибок) и предоставляет методы для установки значений телефона и \
электронной почты , а так жеадреса и выбора оплаты в контейнер.

##### Конструктор Contact

constructor(container: HTMLFormElement, events: IEvents)

##### МетодыContact

```
set phone - устанавливает номер
set email - устанавливает почту
```

#### Класс Page

Класс Page представляет компонент со свойствами счетчика, элементов каталога и статуса блокировки.
и включает методы для обновления этих свойств.

##### Свойства Page

```
protected _counter: HTMLElement - счетчик элементов
protected _catalog: HTMLElement - каталог товаров
protected _wrapper: HTMLElement - сама страница
protected _basket: HTMLElement - корзина
```

##### Конструктор Page

```
constructor(container: HTMLElement, protected events: IEvents) - принимает элементы страницы и ивенты
```

##### Методы Page

```
set counter(value: number) - счетчик товаров
set catalog(items: HTMLElement[]) - размещает товары на странице приложения
set locked(value: boolean) - блокировка страницы
```

#### Класс Succes

Класс Success представляет компонент с элементом итогового значения и кнопкой закрытия формы,
который запускает действие onClick.

##### Свойства Succes

```
 constructor(container: HTMLElement, protected actions: ISuccessActions) - установка общего количества товара, \
 и обработка закрытия
```

##### Конструктор

```
constructor(container: HTMLElement, protected actions: ISuccessActions)
```

##### Методы Succes

```
 total(value: string) - количество товара
```

### Типы данных

Данные товара

```
IProductItem - Товар:
id: string - индивидуальный идентификатор
description: string - описание
image: string - картинка
title: string - тайтл
category: string - категория
price: number - стоимость
```

Модель данных товаров

```
IProductData
items: IProductItem[] - список всех товаров
preview: string - модель товара для просмотра
```

Данные для заполнения формы заказа

```
Заказ  - IOrder
adress: string - адрес
payment: string - выбор оплаты
```

контакты - IContact
phone: string - телефон
email: string - почта

```
форма с кол-вом товаров по id - IForm extends IOrder, IContact, IProductItem
total: number - кол-во товаров
items: IProductItem[] - список товаров
```

Ответ от сервера для формы заказа

```
IFormResponse - ответ
id: string - куленный товар
total: number - кол-во купленных товаров
```

Ошибка валидации формы

```
type FormErrors = Partial<Record<keyof IForm, string>>
```

Корзина товаров

```
IBasket - корзина
basket: IProductItem[] - данные о товарах
```

import Store from '@src/store/store';

export default class MainPage {
  element: HTMLElement;

  store: Store;

  constructor(store:Store, styleClass = 'main') {
    this.element = document.createElement('section');
    this.element.classList.add(styleClass);
    this.store = store;
  }

  create():HTMLElement {
    return this.element;
  }
}

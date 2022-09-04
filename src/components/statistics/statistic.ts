import Store from '@src/store/store';

export default class Statistics {
  element = document.createElement('section');

  store : Store;

  constructor(store:Store) {
    this.store = store;
  }

  create():HTMLElement {
    this.element.classList.add('audio-challenge');
    if (this.store.getAuthorized()) {
      console.log('авторизованный пользователь');
    } else {
      console.log('статистика не доступна не авторизованному пользователю');
    }
    return this.element;
  }
}

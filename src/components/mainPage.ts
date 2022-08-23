export default class MainPage {
  element: HTMLElement;

  constructor() {
    this.element = document.createElement('section');
    this.element.classList.add('main');
  }

  create():HTMLElement {
    return this.element;
  }
}

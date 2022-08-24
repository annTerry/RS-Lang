export default class MainPage {
  element: HTMLElement;

  constructor(styleClass = 'main') {
    this.element = document.createElement('section');
    this.element.classList.add(styleClass);
  }

  create():HTMLElement {
    return this.element;
  }
}

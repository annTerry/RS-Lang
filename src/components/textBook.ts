import MainPage from './mainPage';

export default class Textbook extends MainPage {
  constructor() {
    super('Textbook');
    this.element.textContent = 'Textbook';
  }
}

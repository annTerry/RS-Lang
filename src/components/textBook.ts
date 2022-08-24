import MainPage from './mainPage';

export default class TextBook extends MainPage {
  constructor() {
    super('textbook');
    this.element.textContent = 'textBook';
  }
}

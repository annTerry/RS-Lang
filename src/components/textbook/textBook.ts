import './textbook.scss';
import Store from '@src/store/store';
import { TEXTBOOK_PARTS } from '@common/constants';
import MainPage from '../mainPage';

export default class Textbook extends MainPage {
  constructor(store:Store) {
    super(store, 'Textbook');
    this.element.append(this.drawParts());
  }

  drawParts(currentPart = 0):HTMLElement {
    const partElement = document.createElement('section');
    partElement.classList.add('parts-wrapper');
    const partBaseElement = document.createElement('ul');
    partBaseElement.classList.add('part-container');
    let parts = TEXTBOOK_PARTS;
    if (this.store.getAuthorized()) parts += 1;
    for (let i = 0; i < parts; i += 1) {
      const thisPart = document.createElement('li');
      thisPart.classList.add('textBook-part-name');
      thisPart.classList.add(`textBook-part_${i}`);
      if (i === currentPart) thisPart.classList.add('Active');
      const linkData = document.createElement('a');
      linkData.classList.add('textBook_part_link');
      linkData.setAttribute('href', `#Textbook_${i}`);
      thisPart.addEventListener('click', () => {
        this.store.setCurrentPage('Textbook', i);
      });
      linkData.textContent = `Раздел ${i + 1}`;
      thisPart.append(linkData);
      partBaseElement.append(thisPart);
    }
    partElement.append(partBaseElement);
    this.element.append(partElement);
    return partElement;
  }
}

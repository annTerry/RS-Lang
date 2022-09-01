import './textbook.scss';
import Store from '@src/store/store';
import { TEXTBOOK_PARTS, ALL_PAGES } from '@common/constants';
import GetData from '@src/api/getData';
import MainPage from '../mainPage';

export default class Textbook extends MainPage {
  parts!: HTMLElement;

  wordsSection!: HTMLElement;

  pages!:HTMLElement;

  constructor(store:Store) {
    super(store, 'Textbook');
    this.setPartsAndPages();
    this.store.addWatcher('currentPage', () => {
      this.redrawNavigation();
    });
  }

  redrawNavigation() {
    if (this.store.getCurrentPageName() === 'Textbook') {
      if (this.parts !== undefined) this.element.removeChild(this.parts);
      if (this.pages !== undefined) this.element.removeChild(this.pages);
      if (this.wordsSection !== undefined) this.element.removeChild(this.wordsSection);
      this.setPartsAndPages();
    }
  }

  async rendWords(currentPart = 0, currentPage = 0):Promise<HTMLElement> {
    const sectionWordElement = document.createElement('section');
    sectionWordElement.classList.add('textbook-words-page');
    sectionWordElement.classList.add(`textbook-part_${currentPart}`);
    await GetData.getData(`words?group=${currentPart}&&page=${currentPage}`, (result) => {
      result.forEach((element) => {
        const oneWord = document.createElement('div');
        oneWord.classList.add('textbook-one_word-element');
        oneWord.textContent = element.word;
        sectionWordElement.append(oneWord);
      });
    });
    return sectionWordElement;
  }

  setPartsAndPages() {
    const currentPart = this.store.getCurrentPartNumber();
    const currentPage = this.store.getCurrentPageNumber();
    this.parts = this.drawParts(currentPart);
    this.pages = this.drawPages(currentPart, currentPage);
    this.rendWords(currentPart, currentPage).then((element) => {
      this.wordsSection = element;
      this.element.append(this.parts);
      this.element.append(this.wordsSection);
      this.element.append(this.pages);
    });
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
      linkData.textContent = `Раздел ${i + 1}`;
      thisPart.append(linkData);
      partBaseElement.append(thisPart);
    }
    partElement.append(partBaseElement);
    return partElement;
  }

  drawPages(currentPart = 0, currentPage = 0):HTMLElement {
    const pageElement = document.createElement('section');
    pageElement.classList.add('pagess-wrapper');
    const pageBaseElement = document.createElement('ul');
    pageBaseElement.classList.add('pages-container');
    const pagesLink = this.dataForPagesRender(currentPage);
    console.log(pagesLink);
    pagesLink.forEach((element) => {
      const thisPart = document.createElement('li');
      thisPart.classList.add('textBook-page-link');
      if (element[1] !== -1) {
        const linkData = document.createElement('a');
        linkData.classList.add('textBook_page_link');
        linkData.setAttribute('href', `#Textbook_${currentPart}_${element[1]}`);
        linkData.textContent = element[0].toString();
        thisPart.append(linkData);
      } else {
        thisPart.textContent = element[0].toString();
      }
      pageBaseElement.append(thisPart);
    });
    pageElement.append(pageBaseElement);
    return pageElement;
  }

  dataForPagesRender(currentPage:number):Array<Array<string | number>> {
    const pagesLink = [];

    if (currentPage > 0) pagesLink.push(['Предыдущая', currentPage - 1]);
    for (let i = 0; i < 2; i += 1) {
      if (currentPage === i) pagesLink.push([(i + 1).toString(), -1]);
      else pagesLink.push([(i + 1).toString(), i]);
    }

    if (currentPage === 2) pagesLink.push(['2', -1]);
    else if (currentPage === 3) pagesLink.push(['3', 2]);
    else if (currentPage > 3) pagesLink.push(['...', Math.floor((2 + currentPage) / 2)]);

    if (currentPage > 3 && currentPage <= ALL_PAGES) {
      pagesLink.push([currentPage.toString(), currentPage - 1]);
      pagesLink.push([(currentPage + 1).toString(), -1]);
      if (currentPage < (ALL_PAGES - 3)) pagesLink.push(['...', Math.floor(((ALL_PAGES - 3) + currentPage) / 2)]);
      if (currentPage < (ALL_PAGES - 1)) {
        pagesLink.push([(currentPage + 2).toString(), currentPage + 1]);
        pagesLink.push(['Следующая', currentPage + 1]);
      }
    } else {
      pagesLink.push(['...', Math.floor(ALL_PAGES / 2)]);
      pagesLink.push([(ALL_PAGES - 1).toString(), ALL_PAGES - 2]);
      pagesLink.push([ALL_PAGES.toString(), ALL_PAGES - 1]);
      pagesLink.push(['Следующая', currentPage + 1]);
    }
    return pagesLink;
  }
}

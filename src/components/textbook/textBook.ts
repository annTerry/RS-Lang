import './textbook.scss';
import Store from '@src/store/store';
import { TEXTBOOK_PARTS, ALL_PAGES, DATABASE_LINK } from '@common/constants';
import GetData from '@src/api/getData';
import { TWordSimple } from '@common/baseTypes';
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
    this.store.addWatcher('Authorize', () => {
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
    const wordsContainer = document.createElement('div');
    wordsContainer.classList.add('textbook-word-wrapper');
    const gamesButtonContainer = document.createElement('div');
    gamesButtonContainer.classList.add('games-button-wrapper');
    const sprintButton = document.createElement('a');
    sprintButton.classList.add('one-game-button');
    sprintButton.textContent = 'Спринт';
    sprintButton.href = `#Sprint_${currentPart}_${currentPage}`;
    const audionChallengeButton = document.createElement('a');
    audionChallengeButton.classList.add('one-game-button');
    audionChallengeButton.textContent = 'Аудиочелендж';
    audionChallengeButton.href = `#AudioChallenge_${currentPart}_${currentPage}`;
    gamesButtonContainer.append(sprintButton);
    gamesButtonContainer.append(audionChallengeButton);

    await GetData.getData(`words?group=${currentPart}&&page=${currentPage}`, (result) => {
      result.forEach((element) => {
        wordsContainer.append(this.oneWordShow(element));
      });
    });
    sectionWordElement.append(gamesButtonContainer);
    sectionWordElement.append(wordsContainer);
    return sectionWordElement;
  }

  changeStatForWord(id:string, stat:string) {
    // todo add.or delete word from hard.words
    console.log(id);
    console.log(stat);
  }

  oneWordShow(word: TWordSimple):HTMLElement {
    const wordWrapper = document.createElement('div');
    wordWrapper.classList.add('textbook-one_word-element');
    const wordImage = document.createElement('div');
    wordImage.classList.add('word-image');
    wordImage.style.backgroundImage = `url(${DATABASE_LINK}/${word.image})`;
    wordWrapper.append(wordImage);
    const wordInfoWrapper = document.createElement('div');
    wordInfoWrapper.classList.add('textbook-one_word-info');
    const oneWord = document.createElement('div');
    oneWord.classList.add('textbook-one_word-element');
    const audioElement = document.createElement('div');
    audioElement.classList.add('sound-icon');
    audioElement.addEventListener('click', () => {
      const audio = new Audio();
      audio.src = `${DATABASE_LINK}/${word.audio}`;
      audio.play();
      const audioList = [word.audio, word.audioMeaning, word.audioExample];
      let currentAudio = 0;
      audio.addEventListener('ended', () => {
        currentAudio += 1;
        if (currentAudio < 3) {
          audio.src = `${DATABASE_LINK}/${audioList[currentAudio]}`;
          audio.play();
        }
      });
    });
    oneWord.append(audioElement);
    const wordElement = document.createElement('span');
    wordElement.classList.add('word__text');
    wordElement.textContent = word.word;
    oneWord.append(wordElement);
    const wordTranscription = document.createElement('span');
    wordTranscription.classList.add('word__transcript');
    wordTranscription.textContent = word.transcription;
    oneWord.append(wordTranscription);
    const wordTranslate = document.createElement('span');
    wordTranslate.classList.add('word__translate');
    wordTranslate.textContent = word.wordTranslate;
    oneWord.append(wordTranslate);
    wordInfoWrapper.append(oneWord);
    const wordMining = document.createElement('div');
    wordMining.classList.add('textbook__word-mining');
    wordMining.innerHTML = word.textMeaning;
    wordInfoWrapper.append(wordMining);
    const wordMiningTranslate = document.createElement('div');
    wordMiningTranslate.classList.add('textbook__word-mining_translate');
    wordMiningTranslate.innerHTML = word.textMeaningTranslate;
    wordInfoWrapper.append(wordMiningTranslate);
    const wordExample = document.createElement('div');
    wordExample.classList.add('textbook__word-example');
    wordExample.innerHTML = word.textExample;
    wordInfoWrapper.append(wordExample);
    const wordExampleTranslate = document.createElement('div');
    wordExampleTranslate.classList.add('textbook__word-example_translate');
    wordExampleTranslate.innerHTML = word.textExampleTranslate;
    wordInfoWrapper.append(wordExampleTranslate);
    wordWrapper.append(wordInfoWrapper);
    if (this.store.getAuthorized()) {
      const wordActionsWrapper = document.createElement('div');
      wordActionsWrapper.classList.add('actions-buttons');
      const easyButton = document.createElement('div');
      easyButton.classList.add('word_easy-word');
      easyButton.textContent = 'Знаю!';
      easyButton.addEventListener('click', () => {
        this.changeStatForWord(word.id, 'easy');
      });
      const hardButton = document.createElement('div');
      hardButton.classList.add('word_hard-word');
      hardButton.textContent = 'Сложно!';
      hardButton.addEventListener('click', () => {
        this.changeStatForWord(word.id, 'hard');
      });
      wordActionsWrapper.append(easyButton);
      wordActionsWrapper.append(hardButton);
      wordWrapper.append(wordActionsWrapper);
    }
    return wordWrapper;
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
      if (currentPart !== 6) {
        this.element.append(this.pages);
      }
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
    pageElement.classList.add('pages-wrapper');
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

    if (currentPage === 2) {
      pagesLink.push(['3', -1]);
      pagesLink.push(['4', 3]);
    } else if (currentPage === 1) pagesLink.push(['3', 2]);
    else if (currentPage > 3) pagesLink.push(['...', Math.floor((2 + currentPage) / 2)]);

    if (currentPage > 2 && currentPage <= ALL_PAGES) {
      pagesLink.push([currentPage.toString(), currentPage - 1]);
      pagesLink.push([(currentPage + 1).toString(), -1]);
      if (currentPage < (ALL_PAGES - 1)) {
        pagesLink.push([(currentPage + 2).toString(), currentPage + 1]);
      }
    }
    if (currentPage < (ALL_PAGES - 4)) {
      pagesLink.push(['...', currentPage + Math.floor((ALL_PAGES - currentPage) / 2)]);
    }
    if (currentPage < (ALL_PAGES - 3)) {
      pagesLink.push([(ALL_PAGES - 1).toString(), ALL_PAGES - 2]);
    }
    if (currentPage < (ALL_PAGES - 2)) {
      pagesLink.push([ALL_PAGES.toString(), ALL_PAGES - 1]);
    }
    if (currentPage < (ALL_PAGES - 1)) {
      pagesLink.push(['Следующая', currentPage + 1]);
    }
    return pagesLink;
  }
}

import './styles.scss';
import { StartPopUpLayout, gameLayout, questionLayout } from './create-html';
import { DATABASE_LINK, ALL_PAGES, LIVES_GAME } from '../../common/constants';
import { TWordSimple } from '../../common/baseTypes';
import Question from './question';
import AudioChallengeResults from './results';

async function getWords(level:number, pageNumber?: number) {
  let page:number;
  if (!pageNumber) {
    page = Math.floor(Math.random() * ALL_PAGES);
  } else {
    page = pageNumber;
  }
  const res = await fetch(`${DATABASE_LINK}/words?group=${level}&page=${page}`);
  const wordsArray: Array<TWordSimple> = await res.json();
  return wordsArray;
}

export default class AudioChallenge {
  group:number;

  element = document.createElement('section');

  page: number | undefined;

  wordsArray: TWordSimple[];

  questionNum: number;

  correctAnswers: TWordSimple[];

  wrongAnswers: TWordSimple[];

  livesInGame: number;

  seriesNow: number;

  seriesResult: number;

  constructor() {
    this.group = -1;
    this.page = undefined;
    this.questionNum = 0;
    this.wordsArray = [];
    this.correctAnswers = [];
    this.wrongAnswers = [];
    this.livesInGame = LIVES_GAME;
    this.seriesNow = 0;
    this.seriesResult = 0;
  }

  create():HTMLElement {
    this.element.classList.add('audio-challenge');
    const gameWrapper = '<div class="games-wrapper"></div>';
    this.element.innerHTML = gameWrapper;
    // если пришли с главной страницы
    this.drawLayout(StartPopUpLayout, 'games-wrapper');
    const btnLevels = <HTMLElement> this.element.getElementsByClassName('buttons-levels-wrapper')[0];
    btnLevels.addEventListener('click', (e: Event) => { this.handleLevelBtn(e); });
    return this.element;
  }

  drawLayout(HTMLLayout: string, wrapperClass:string) {
    const wrapper = <HTMLElement> this.element.getElementsByClassName(wrapperClass)[0];
    wrapper.innerHTML = HTMLLayout;
  }

  async handleLevelBtn(e: Event) {
    const elm = <HTMLElement>e.target;
    const arrayId = ['level1', 'level2', 'level3', 'level4', 'level5', 'level6'];
    this.group = arrayId.indexOf(elm.id);
    if (this.group !== -1) {
      this.drawLayout(gameLayout, 'games-wrapper');
      this.drawLayout(questionLayout, 'game-question');
      this.wordsArray = await getWords(this.group, this.page);
      this.startGame();
    }
  }

  async startGame() {
    // const wordsArray = await getWords(this.group, this.page);
    const word = this.wordsArray[this.questionNum];
    const randomAnswers = this.getRandomAnswers(this.wordsArray, word.wordTranslate);
    const question = new Question(word, randomAnswers);
    question.render();
    // кнопка пропустить
    const skipBtn = <HTMLElement> document.getElementById('skip');
    skipBtn.addEventListener('click', () => { question.showAnswers(); });
    // кнопка далее
    const nextBtn = <HTMLElement> document.getElementById('next');
    nextBtn.addEventListener('click', () => { this.handleNextBtn(question); });
  }

  getRandomAnswers(wordsArray:Array<TWordSimple>, word:string):Array<string> {
    const randomAnswers: Set<string> = new Set();
    do {
      const newIndex = Math.floor(Math.random() * wordsArray.length);
      const answer = wordsArray[newIndex].wordTranslate;
      if (answer !== word) randomAnswers.add(wordsArray[newIndex].wordTranslate);
    } while (randomAnswers.size !== 4);
    return Array.from(randomAnswers);
  }

  handleNextBtn(question: Question) {
    if (question.isCorrect) {
      this.correctAnswers.push(question.word);
      this.seriesNow += 1;
    } else {
      this.wrongAnswers.push(question.word);
      this.livesInGame -= 1;
      this.getSeriesResult();
      this.drawLives();
    }

    if ((this.livesInGame > 0) && (this.questionNum < this.wordsArray.length - 1)) {
      this.questionNum += 1;
      this.drawLayout(questionLayout, 'game-question');
      this.startGame();
    } else {
      // game over
      const result = new AudioChallengeResults(
        this.correctAnswers,
        this.wrongAnswers,
        this.seriesResult,
      );
      result.start();
    }
  }

  getSeriesResult() {
    if (this.seriesNow > this.seriesResult) this.seriesResult = this.seriesNow;
    this.seriesNow = 0;
  }

  drawLives() {
    const livesArray = this.element.querySelectorAll('.live-item');
    const liveItem = <HTMLElement>livesArray[LIVES_GAME - this.livesInGame - 1];
    liveItem.classList.add('live-item_over');
  }
}

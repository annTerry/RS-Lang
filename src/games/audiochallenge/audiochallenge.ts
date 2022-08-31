import './styles.scss';
import { StartPopUpLayout, gameLayout, questionLayout } from './create-html';
import {
  DATABASE_LINK, ALL_PAGES, LIVES_GAME, CORRECT_COUNT, CORRECT_COUNT_HARD,
} from '../../common/constants';
import { TWordSimple, TUserWord } from '../../common/baseTypes';
import Question from './question';
import AudioChallengeResults from './results';
import Store from '../../store/store';
import { getUserWord, createUserWord, updateUserWord } from '../../api/userWords';

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

  store: Store;

  newWords: number;

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
    this.store = new Store();
    this.newWords = 0;
  }

  create():HTMLElement {
    this.element.classList.add('audio-challenge');
    const gameWrapper = '<div class="games-wrapper"></div>';
    this.element.innerHTML = gameWrapper;
    // если пришли с главной страницы
    this.drawLayout(StartPopUpLayout, 'games-wrapper');
    const btnLevels = <HTMLElement> this.element.getElementsByClassName('buttons-levels-wrapper')[0];
    btnLevels.addEventListener('click', (e: Event) => { this.handleLevelBtn(e); });
    // выбор уровня с клавиатуры
    document.onkeydown = (e) => { this.handleLevelKeyboard(e); };

    //  getCurrentPage()
    console.log(' getAuthorized()', this.store.getAuthorized());
    console.log(' getUser', this.store.getUser());
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
    nextBtn.addEventListener('click', async () => { await this.handleNextBtn(question); });
    // клавиатура
    document.onkeydown = async (e) => { await this.handleKeyboard(e, question); };
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

  async handleNextBtn(question: Question) {
    if (question.isCorrect) {
      this.correctAnswers.push(question.word);
      this.seriesNow += 1;
      if (this.store.getAuthorized()) {
        await this.updateCorrectUserWord(question.word);
      }
    } else {
      this.wrongAnswers.push(question.word);
      this.livesInGame -= 1;
      this.getSeriesResult();
      this.drawLives();
      if (this.store.getAuthorized()) {
        await this.updateIncorrectUserWord(question.word);
      }
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

  async handleKeyboard(e:KeyboardEvent, question: Question) {
    if (e.key === ' ') {
      e.preventDefault();
      question.play();
    }
    const answerNumber = Number(e.key);
    if (answerNumber > 0 && answerNumber < 6) {
      e.preventDefault();
      question.showAnswers();
      question.checkAnswer(`answer${e.key}`);
    }
    const nextBtns = <HTMLElement> document.querySelector('#next');
    if (nextBtns.classList.contains('conceal')) {
      if (e.key === 'Enter') {
        e.preventDefault();
        question.showAnswers();
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      await this.handleNextBtn(question);
    }
  }

  async handleLevelKeyboard(e: KeyboardEvent) {
    const group = Number(e.key) - 1;
    if (group >= 0 && group < 6) {
      this.drawLayout(gameLayout, 'games-wrapper');
      this.drawLayout(questionLayout, 'game-question');
      this.wordsArray = await getWords(group, this.page);
      this.startGame();
    }
  }

  async updateCorrectUserWord(word: TWordSimple) {
    const user = this.store.getUser();
    const wordData = await getUserWord(user.id, user.token, word.id);
    // новое слово
    if (!wordData) {
      this.newWords += 1;
      const userWordData = {
        difficulty: 'normal',
        optional: {
          correctCount: 1,
          isStudy: false,
          totalCorrectCount: 1,
          totalIncorrectCount: 0,
        },
      };
      createUserWord(user.id, user.token, word.id, userWordData);
    } else {
      // обновить слово
      wordData.optional.correctCount += 1;
      wordData.optional.totalCorrectCount += 1;
      if ((wordData.difficulty === 'normal' && wordData.optional.correctCount >= CORRECT_COUNT)
      || (wordData.difficulty === 'hard' && wordData.optional.correctCount >= CORRECT_COUNT_HARD)) {
        wordData.optional.isStudy = true;
      }
      updateUserWord(user.id, user.token, word.id, wordData);
    }
  }

  async updateIncorrectUserWord(word: TWordSimple) {
    const user = this.store.getUser();
    const wordData = await getUserWord(user.id, user.token, word.id);
    let userWordData: TUserWord;
    // новое слово
    if (!wordData) {
      this.newWords += 1;
      userWordData = {
        difficulty: 'normal',
        optional: {
          correctCount: 0,
          isStudy: false,
          totalCorrectCount: 0,
          totalIncorrectCount: 1,
        },
      };
      createUserWord(user.id, user.token, word.id, userWordData);
    } else {
      // обновить слово
      wordData.optional.correctCount = 0;
      wordData.optional.totalIncorrectCount += 1;
      if (wordData.isStudy) {
        wordData.isStudy = false;
      }
      updateUserWord(user.id, user.token, word.id, wordData);
    }
  }
}

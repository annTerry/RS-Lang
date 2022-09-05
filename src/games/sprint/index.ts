import './styles.scss';
import Store from '@src/store/store';
import {
  LIVES_GAME, CORRECT_COUNT, CORRECT_COUNT_HARD,
} from '@common/constants';
import { TWordSimple, TUserWord } from '@common/baseTypes';
import {
  getUserWord, createUserWord, updateUserWord, getUserWords, getWords,
} from '@src/api/userWords';
import { updateUserStatistic, getUserStatistic } from '@src/api/userStatistic';
import isDataToday from '@src/helpers';
import AudioChallengeResults from '../audiochallenge/results';
import Question from '../audiochallenge/question';
import { StartPopUpLayout, gameLayout, questionLayout } from './html';

export default class SprintChallenge {
  group: number | undefined;

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

  learnedWords: number;

  constructor(store: Store) {
    this.store = store;
    this.group = 0;
    this.page = 0;
    this.questionNum = 0;
    this.wordsArray = [];
    this.correctAnswers = [];
    this.wrongAnswers = [];
    this.livesInGame = LIVES_GAME;
    this.seriesNow = 0;
    this.seriesResult = 0;
    this.newWords = 0;
    this.learnedWords = 0;
  }

  create():HTMLElement {
    this.element.classList.add('audio-challenge');
    this.element.innerHTML = '<div class="games-wrapper"></div>';
    // скрываем footer
    const footer = <HTMLElement> document.getElementsByClassName('footer')[0];
    if (footer) footer.classList.add('conceal');

    this.group = this.store.getCurrentPartNumber();
    this.page = this.store.getCurrentPageNumber();
    console.log(this.group, this.page);
    // если пришли с главной страницы
    if (this.group === undefined
      || this.page === undefined) {
      this.drawLayout(StartPopUpLayout, 'games-wrapper');
      const btnLevels = <HTMLElement> this.element.getElementsByClassName('buttons-levels-wrapper')[0];
      btnLevels.addEventListener('click', (e: Event) => { this.handleLevelBtn(e); });
      // выбор уровня с клавиатуры
      document.onkeydown = (e) => { this.handleLevelKeyboard(e); };
    } else {
      this.startGameInTextBook();
    }

    return this.element;
  }

  async startGameInTextBook() {
    this.drawLayout(gameLayout, 'games-wrapper');
    this.drawLayout(questionLayout, 'game-question');
    if (this.store.getAuthorized()) {
      const user = this.store.getUser();
      if (this.group && this.page) {
        this.wordsArray = await getUserWords(this.group, this.page, user.id, user.token);
      // console.log(this.wordsArray);
      }
    } else if (this.group) this.wordsArray = await getWords(this.group, this.page);

    this.startGame();
  }

  drawLayout(HTMLLayout: string, wrapperClass:string) {
    const wrapper = <HTMLElement> this.element.getElementsByClassName(wrapperClass)[0];
    wrapper.innerHTML = HTMLLayout;
  }

  async handleLevelBtn(e: Event) {
    const elm = <HTMLElement>e.target;
    const arrayId = ['bt_false', 'bt_true'];
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
      if (this.store.getAuthorized()) {
        await this.updateIncorrectUserWord(question.word);
      }
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
      if (this.store.getAuthorized()) {
        await this.setStatisticGame();
      }
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
    /* eslint no-underscore-dangle: 0 */
    const wordId = word.id ? word.id : word._id;
    let wordData;
    if (wordId) wordData = await getUserWord(user.id, user.token, wordId);
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
      if (wordId) createUserWord(user.id, user.token, wordId, userWordData);
    } else {
      // обновить слово
      wordData.optional.correctCount += 1;
      wordData.optional.totalCorrectCount += 1;
      if (wordData.difficulty === 'normal' && wordData.optional.correctCount >= CORRECT_COUNT) {
        wordData.optional.isStudy = true;
        this.learnedWords += 1;
      }
      if (wordData.difficulty === 'hard' && wordData.optional.correctCount >= CORRECT_COUNT_HARD) {
        wordData.optional.isStudy = true;
        wordData.difficulty = 'normal';
        this.learnedWords += 1;
      }
      if (wordId) updateUserWord(user.id, user.token, wordId, wordData);
    }
  }

  async updateIncorrectUserWord(word: TWordSimple) {
    const user = this.store.getUser();
    const wordId = word.id ? word.id : word._id;
    let wordData;
    if (wordId) wordData = await getUserWord(user.id, user.token, wordId);
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
      if (wordId) createUserWord(user.id, user.token, wordId, userWordData);
    } else {
      // обновить слово
      wordData.optional.correctCount = 0;
      wordData.optional.totalIncorrectCount += 1;
      if (wordData.isStudy) {
        wordData.isStudy = false;
        this.learnedWords -= 1;
      }
      if (wordId) updateUserWord(user.id, user.token, wordId, wordData);
    }
  }

  async setStatisticGame() {
    const statistic = await getUserStatistic(
      this.store.getUser().id,
      this.store.getUser().token,
    );
    if ((!statistic) || (!isDataToday(statistic.optional.date))) {
      const statisticObj = {
        learnedWords: 0,
        optional: {
          date: new Date().toLocaleDateString(),
          audioChallenge: {
            correctAnswers: this.correctAnswers.length,
            wrongAnswers: this.wrongAnswers.length,
            series: this.seriesResult,
            newWords: this.newWords,
          },
        },
      };
      await updateUserStatistic(
        this.store.getUser().id,
        this.store.getUser().token,
        statisticObj,
      );
    } else {
      const { id, ...statisticObj } = statistic;
      statisticObj.learnedWords += this.learnedWords;
      statisticObj.optional.audioChallenge.correctAnswers += this.correctAnswers.length;
      statisticObj.optional.audioChallenge.wrongAnswers += this.wrongAnswers.length;
      statisticObj.optional.audioChallenge.series = (
        this.seriesResult > statisticObj.optional.audioChallenge.series
      ) ? this.seriesResult : statisticObj.optional.audioChallenge.series;
      statisticObj.optional.audioChallenge.newWords += this.newWords;
      await updateUserStatistic(
        this.store.getUser().id,
        this.store.getUser().token,
        statisticObj,
      );
    }
  }
}

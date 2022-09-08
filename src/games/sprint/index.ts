import './style.scss';
import Store from '@src/store/store';
import {
  CORRECT_COUNT, CORRECT_COUNT_HARD, SPRINT_DURATION, TEXTBOOK_PARTS
} from '@common/constants';
import { TWordSimple, TUserWord } from '@common/baseTypes';
import {
  getUserWord, createUserWord, updateUserWord, getUserWords, getWords, getUserHardWords,
} from '@src/api/userWords';
// import { updateUserStatistic, getUserStatistic } from '@src/api/userStatistic';
// import isDataToday from '@src/helpers';
import SprintChallengeResults from './results';
import Question from './question';
import { StartPopUpLayout, gameLayout, questionLayout } from './html';

export default class SprintChallenge {
  group: number | undefined;
  element = document.createElement('section');
  page: number | undefined;
  wordsArray: TWordSimple[];
  questionNum: number;
  correctAnswers: TWordSimple[];
  wrongAnswers: TWordSimple[];
  seriesNow: number;
  seriesResult: number;
  store: Store;
  newWords: number;
  learnedWords: number;
  timer: number | undefined;
  remainSeconds: number;

  constructor(store: Store) {
    this.store = store;
    this.group = 0;
    this.page = 0;
    this.questionNum = 0;
    this.wordsArray = [];
    this.correctAnswers = [];
    this.wrongAnswers = [];
    this.seriesNow = 0;
    this.seriesResult = 0;
    this.newWords = 0;
    this.learnedWords = 0;
    this.remainSeconds = SPRINT_DURATION;
  }

  create(): HTMLElement {
    const { hash } = document.location;
    this.element.classList.add('sprint-challenge', 'container');
    this.element.innerHTML = '<div class="games-wrapper"></div>';
    // скрываем footer
    const footer = <HTMLElement> document.getElementsByClassName('footer')[0];
    if (footer) footer.classList.add('hide');

    this.group = this.store.getCurrentPartNumber();
    this.page = this.store.getCurrentPageNumber();

    if (hash === '#SprintChallenge') {
      this.drawLayout(StartPopUpLayout, 'games-wrapper');
      const btnLevels = <HTMLElement> this.element.getElementsByClassName('buttons-levels-wrapper')[0];
      btnLevels.addEventListener('click', e => {
        this.handleLevelBtn(e);
      });
      // выбор уровня с клавиатуры
      document.onkeydown = (e) => {
        this.handleLevelKeyboard(e);
      };
    } else {
      const arrHash = hash.split('_');
      this.group = Number(arrHash[1]);
      this.page = Number(arrHash[2]);
      this.startGameInTextBook();
    }

    return this.element;
  }

  async startGameInTextBook() {
    this.drawLayout(gameLayout, 'games-wrapper');
    this.drawLayout(questionLayout, 'game-question');
    if (this.store.getAuthorized()) {
      const user = this.store.getUser();
      if (this.group === 6) {
        this.wordsArray = await getUserHardWords(user.id, user.token);
      } else if (this.group !== undefined && this.page !== undefined) {
        this.wordsArray = await getUserWords(this.group, this.page, user.id, user.token);
      }
    } else if (this.group && this.group < 6) {
      this.wordsArray = await getWords(this.group, this.page);
    }
    if (this.wordsArray.length < 2) {
      this.element.innerHTML = `
      <p> Недостаточно данных для игры </p>
      `;
    } else {
      this.startGame();
    }
  }

  drawLayout(HTMLLayout: string, wrapperClass:string) {
    const wrapper = <HTMLElement> this.element.getElementsByClassName(wrapperClass)[0];
    wrapper.innerHTML = HTMLLayout;
  }

  // Выбор уровня при клике мышкой на кнопку
  async handleLevelBtn(e: Event) {
    e.preventDefault();
    const el = e.target as HTMLElement;
    const level = Number(el.dataset.id);
    this.selectLevel(level);
  }

  // Выбор уровня при нажатии на клавишу 1-6
  async handleLevelKeyboard(e: KeyboardEvent) {
    const level = Number(e.key);
    if (!isNaN(level) && level > 0 && level <= TEXTBOOK_PARTS) {
      e.preventDefault();
      this.selectLevel(level);
    }
  }

  // Установка уровня игры (1-6)
  async selectLevel(level: number) {
    if (level > 0 && level <= TEXTBOOK_PARTS) {
      this.group = level - 1;
      this.drawLayout(gameLayout, 'games-wrapper');
      this.drawLayout(questionLayout, 'game-question');
      this.wordsArray = await getWords(this.group, this.page);
      this.startGame();
    } else {
      this.group = -1;
    }
  }

  async startGame() {
    const firstIdx = this.questionNum;
    if (this.timer === undefined) {
      this.setTimer();
    }
    if (firstIdx >= this.wordsArray.length) return;
    const randomAnswers = this.get2Words(this.wordsArray, firstIdx);
    const question = new Question(randomAnswers);
    question.render();
    // Проверяем ответ (кнопки)
    const btnAnswersContainer = <HTMLElement>document.querySelector('.btn-answer-wrapper');
    btnAnswersContainer.addEventListener('click', e => {
      this.handleAnswersBtn(e, question);
    });
    // Проверяем ответ (клавиши-стрелки)
    document.onkeydown = async (e) => {
      await this.handleKeyboard(e, question);
    };
  }

  async finishGame() {
    const result = new SprintChallengeResults(
      this.correctAnswers,
      this.wrongAnswers,
      this.seriesResult,
    );
    if (this.store.getAuthorized()) {
      //await this.setStatisticGame();
    }
    result.start();
  }

  get2Words(wordsArray: Array<TWordSimple>, firstIdx: number): Array<TWordSimple> {
    const randomAnswers: Set<TWordSimple> = new Set();
    randomAnswers.add(wordsArray[firstIdx]);
    do {
      const idx = Math.floor(Math.random() * wordsArray.length);
      if (idx !== firstIdx) {
        randomAnswers.add(wordsArray[idx]);
      }
    } while (randomAnswers.size !== 2);
    return Array.from(randomAnswers);
  }

  async handleNextBtn(question: Question) {
    const div = document.querySelector('.game-question') as HTMLElement;
    if (question.isCorrect) {
      div.classList.add('game-question_true');
      this.correctAnswers.push(question.words[0]);
      this.seriesNow += 1;
      if (this.store.getAuthorized()) {
        await this.updateCorrectUserWord(question.words[0]);
      }
    } else {
      div.classList.add('game-question_false');
      if (this.store.getAuthorized()) {
        await this.updateIncorrectUserWord(question.words[0]);
      }
      this.wrongAnswers.push(question.words[0]);
      this.getSeriesResult();
    }

    setTimeout(() => {
      div.classList.remove('game-question_true', 'game-question_false');
    }, 500);

    if ((this.remainSeconds > 0) && (this.questionNum < this.wordsArray.length - 1)) {
      this.questionNum += 1;
      this.drawLayout(questionLayout, 'game-question');
      this.startGame();
    } else {
      this.finishGame();
    }
  }

  getSeriesResult() {
    if (this.seriesNow > this.seriesResult) {
      this.seriesResult = this.seriesNow;
    }
    this.seriesNow = 0;
  }

  async handleKeyboard(e: KeyboardEvent, question: Question) {
    const code = e.code;
    if (code === 'ArrowLeft' || code === 'ArrowRight') {
      e.preventDefault();
      const isTrue = code === 'ArrowRight';
      question.checkAnswer(isTrue);
      await this.handleNextBtn(question);
    }
  }

  async handleAnswersBtn(e: Event, question: Question) {
    const answer = Boolean((<HTMLElement>e.target).dataset.answer);
    question.checkAnswer(answer);
    await this.handleNextBtn(question);
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
      wordData.optional.correctCount++;
      wordData.optional.totalCorrectCount++;
      if (wordData.difficulty === 'normal' && wordData.optional.correctCount >= CORRECT_COUNT) {
        wordData.optional.isStudy = true;
        this.learnedWords++;
      }
      if (wordData.difficulty === 'hard' && wordData.optional.correctCount >= CORRECT_COUNT_HARD) {
        wordData.optional.isStudy = true;
        wordData.difficulty = 'normal';
        this.learnedWords++;
      }
      if (wordId) {
        updateUserWord(user.id, user.token, wordId, wordData);
      }
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

  /*async setStatisticGame() {
    const statistic = await getUserStatistic(
      this.store.getUser().id,
      this.store.getUser().token
    );
    if ((!statistic) || (!isDataToday(statistic.optional.date))) {
      const statisticObj = {
        learnedWords: 0,
        optional: {
          date: new Date().toLocaleDateString(),
          sprintChallenge: {
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
        statisticObj
      );
    } else {
      const { id, ...statisticObj } = statistic;
      statisticObj.learnedWords += this.learnedWords;
      statisticObj.optional.sprintChallenge.correctAnswers += this.correctAnswers.length;
      statisticObj.optional.sprintChallenge.wrongAnswers += this.wrongAnswers.length;
      statisticObj.optional.sprintChallenge.series = (
        this.seriesResult > statisticObj.optional.sprintChallenge.series
      ) ? this.seriesResult : statisticObj.optional.sprintChallenge.series;
      statisticObj.optional.sprintChallenge.newWords += this.newWords;
      await updateUserStatistic(
        this.store.getUser().id,
        this.store.getUser().token,
        statisticObj
      );
    }
  }*/

  setTimer() {
    this.remainSeconds = SPRINT_DURATION;
    const timer = <HTMLElement> document.querySelector('.game-timer');
    this.timer = window.setInterval(() => {
      timer.innerHTML = String(--this.remainSeconds);
      if (this.remainSeconds < 10) {
        timer.classList.add('game-timer_alert');
      }
      if (this.remainSeconds <= 0) {
        window.clearInterval(this.timer);
        this.finishGame();
      }
    }, 1000);
  }

};

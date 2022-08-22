import './styles.scss';
import { StartPopUpLoyout, gameLoyout } from './create-html';
import { DATABASE_LINK } from '../../common/constants';
import { TWordSimple } from '../../common/baseTypes';
import getMixArray from './util';

async function getWords(level:number, pageNumber?: number) {
  let wordsArray: Array<TWordSimple>;
  if (pageNumber) {
    console.log('page');
    const res = await fetch(`${DATABASE_LINK}/words?group=${level}&page=${pageNumber}`);
    wordsArray = await res.json();
  } else {
    const res = await fetch(`${DATABASE_LINK}/words?group=${level}`);
    wordsArray = await res.json();
  }
  return wordsArray;
}

export default class AudioChallenge {
  group:number;

  page: number | undefined;

  constructor() {
    this.group = -1;
    this.page = undefined;
  }

  creat() {
    const main = <HTMLElement>document.querySelector('main');
    const gameWrapper = '<div class="games-wrapper"></div>';
    main.innerHTML = gameWrapper;
    // если пришли с главной страницы
    this.drawGameLayout(StartPopUpLoyout);
    const btnLevels = <HTMLElement>document.querySelector('.buttons-levels-wrapper');
    btnLevels.addEventListener('click', (e: Event) => { this.handleLevelBtn(e); });
  }

  drawGameLayout(HTMLLayout: string) {
    const gameWrapper = <HTMLElement>document.querySelector('.games-wrapper');
    gameWrapper.innerHTML = HTMLLayout;
  }

  handleLevelBtn(e: Event) {
    const elm = <HTMLElement>e.target;
    const arrayId = ['level1', 'level2', 'level3', 'level4', 'level5', 'level6'];
    this.group = arrayId.indexOf(elm.id);
    if (this.group !== -1) {
      this.group += 1;
      this.drawGameLayout(gameLoyout);
      this.startGame();
    }
  }

  async startGame() {
    const wordsArray = await getWords(this.group, this.page);
    console.log(wordsArray);
    const word = wordsArray[0];
    const randomAnswers = this.getRandomAnswers(wordsArray, word.wordTranslate);
    console.log(randomAnswers);
    this.askNewWord(word, randomAnswers);
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

  play(pathAudio: string) {
    const audio = new Audio(pathAudio);
    audio.src = `${DATABASE_LINK}/${pathAudio}`;
    audio.play();
  }

  askNewWord(word: TWordSimple, randomAnswers:Array<string>) {
    const playAudioBtn = <HTMLElement>document.getElementById('play-audio');
    playAudioBtn.addEventListener('click', () => { this.play(word.audio); });
    const answerText = <HTMLElement>document.getElementById('answer');
    answerText.innerText = `${word.word} ${word.transcription}`;
    const idTrueAnswer = `answer${Math.floor(Math.random() * 5) + 1}`;
    console.log(idTrueAnswer);
    (<HTMLElement>document.getElementById(idTrueAnswer)).innerText = word.wordTranslate;
    const btnAnswersList = document.querySelectorAll('.btn-answer');
    let btnAnswersArray = Array.prototype.slice.call(btnAnswersList);

    btnAnswersArray = btnAnswersArray.filter((btn) => (btn.id !== idTrueAnswer));
    randomAnswers.forEach((value, index) => { btnAnswersArray[index].innerText = value; });
  }
}

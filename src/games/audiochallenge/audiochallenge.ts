import './styles.scss';
import { StartPopUpLoyout, gameLoyout } from './create-html';
import { DATABASE_LINK } from '../../common/constants';
import { TWordSimple } from '../../common/baseTypes';

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
    // звук
    const playAudioBtn = <HTMLElement>document.getElementById('play-audio');
    playAudioBtn.addEventListener('click', () => { this.play(word.audio); });
    // правильный ответ
    const answerText = <HTMLElement>document.getElementById('answer');
    answerText.innerText = `${word.word} ${word.transcription}`;
    // правильный ответ в случайном месте
    const idTrueAnswer = `answer${Math.floor(Math.random() * 5) + 1}`;
    console.log(idTrueAnswer);
    (<HTMLElement>document.getElementById(idTrueAnswer)).innerText = word.wordTranslate;
    const btnAnswersList = document.querySelectorAll('.btn-answer');
    let btnAnswersArray = Array.prototype.slice.call(btnAnswersList);
    // случайные ответы
    btnAnswersArray = btnAnswersArray.filter((btn) => (btn.id !== idTrueAnswer));
    randomAnswers.forEach((value, index) => { btnAnswersArray[index].innerText = value; });
    // слушаем ответ
    const btnAnswersContener = <HTMLElement>document.querySelector('.btn-answer-wrapper');
    btnAnswersContener.addEventListener('click', (e) => { this.handleAnswersBtn(e, idTrueAnswer, word.image); });
  }

  handleAnswersBtn(e:Event, idTrueAnswer: string, pathImage:string) {
    const elm = <HTMLElement>e.target;
    if (elm.id) {
      const arrayId = ['answer1', 'answer2', 'answer3', 'answer4', 'answer5'];
      arrayId.forEach((itemId) => {
        const btnItem = <HTMLInputElement>document.getElementById(itemId);
        btnItem.disabled = true;
        if (itemId === idTrueAnswer) {
          btnItem.classList.add('btn-answer_true');
        } else {
          btnItem.classList.add('btn-answer_false');
        }
      });
      // показать ответ
      const answerText = <HTMLElement>document.getElementById('answer');
      answerText.classList.remove('hidden-style');
      //изменить кнопку
      const skipBtn = <HTMLElement>document.getElementById('skip');
      skipBtn.innerText = 'Далее';
      // показать картинку
      const playAudioBtn = <HTMLElement>document.getElementById('play-audio');
      playAudioBtn.classList.add('audio-wrapper_hidden');
      const answerImg = <HTMLElement>document.getElementById('answer-img');
      console.log(answerImg)
      answerImg.style.backgroundImage = `url(${DATABASE_LINK}/${pathImage})`;
      answerImg.classList.add('answer-img_active');
    }
  }
}

import { TWordSimple } from '../../common/baseTypes';
import { DATABASE_LINK } from '../../common/constants';

export default class AudioChallengeResults {
  correct: TWordSimple[];

  wrong: TWordSimple[];

  seriesResult: number;

  constructor(correct: TWordSimple[], wrong: TWordSimple[], seriesResult: number) {
    this.correct = correct;
    this.wrong = wrong;
    this.seriesResult = seriesResult;
  }

  render() {
    const wrapper = <HTMLElement> document.getElementsByClassName('games-wrapper')[0];
    wrapper.innerHTML = `
    <div class = "games-popup">
    <h3 class="games-popup__title">Результаты</h3>
    <h4 class="games-popup__subtitle">Длина серии: ${this.seriesResult}</h4>
    <div class="results-container">
      <div class="results-correct">
        <h4 class="games-popup__subtitle">Знаю: ${this.correct.length}</h4>
        <ul class="results-list">${this.generateWordsList(this.correct)}</ul>
      </div>
      <div class="results-wrong">
        <h4 class="games-popup__subtitle">Ошибок: ${this.wrong.length}</h4>
        <ul class="results-list">${this.generateWordsList(this.wrong)}</ul>
      </div>
    </div>
    <div class="game-links-contener">
      <a class="game-link" href="#">К учебнику</a>
      <a class="game-link" href="#">К играм</a>
    </div>
    </div>
    `;
  }

  start() {
    this.render();
    const correctContener = <HTMLElement>document.querySelector('.results-correct');
    correctContener.addEventListener('click', (e) => { this.handleResults(e, this.correct); });
    const wrongContener = <HTMLElement>document.querySelector('.results-wrong');
    wrongContener.addEventListener('click', (e) => { this.handleResults(e, this.wrong); });
  }

  generateWordsList(words: TWordSimple[]):string {
    let wordList = '';
    words.forEach((word, index) => {
      wordList += `<li class="results-item">
      <div class="sound-icon" data-id="${index}"></div>
      <span class ="results-item__text">${word.word}</span>
      <span> — ${word.wordTranslate}</span>
      </li>`;
    });
    return wordList;
  }

  handleResults(e:Event, words: TWordSimple[]) {
    const elm = <HTMLElement>e.target;
    if (elm.dataset.id) {
      const word = words[Number(elm.dataset.id)];
      const audio = new Audio();
      audio.src = `${DATABASE_LINK}/${word.audio}`;
      audio.play();
    }
  }
}

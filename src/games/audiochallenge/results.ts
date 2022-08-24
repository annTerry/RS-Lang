import { TWordSimple } from '../../common/baseTypes';

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

  generateWordsList(words: TWordSimple[]):string {
    let wordList = '';
    console.log(words);
    words.forEach((word) => {
      console.log('word', word);
      wordList += `<li class="results-item">
      <div class="sound-icon"></div>
      <span class ="results-item__text">${word.word}</span>
      <span> — ${word.wordTranslate}</span>
      </li>`;
      console.log('wordList', wordList);
    });
    return wordList;
  }
}

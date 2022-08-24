import { TWordSimple } from '../../common/baseTypes';

class AudioChallengeResults {
  correct: TWordSimple[];

  wrong: TWordSimple[];

  seriesResult: number;

  constructor(correct: TWordSimple[], wrong: TWordSimple[], seriesResult: number) {
    this.correct = correct;
    this.wrong = wrong;
    this.seriesResult = seriesResult;
  }
  render() {
    const wrapper = <HTMLElement> this.element.getElementsByClassName('games-wrapper')[0];
    this.container.classList.add('audiocall__results');
    wrapper.innerHTML = `
    <div class = "games-popup">
    <h3 class="games-popup__title">Результаты</h3>
    <p class="games-popup__text">Длина серии:${this.seriesResult}</p>
    <div class="results-container">
      <div class="results-correct">
        <h4 class="games-popup__subtitle">Знаю:${this.correct.length}</h4>
        <ul class="results__list">${this.generateWordsList(this.correct)}</ul>
      </div>
      <div class="results-wrong">
        <h4 class="games-popup__subtitle">Ошибок:${this.wrong.length}</h4>
        <ul class="results__list">${this.generateWordsList(this.wrong)}</ul>
      </div>
    </div>
    <div class='audiocall__links'>
      <a class="btn-next" href='#'>К учебнику</a>
      <a class='audiocall__link' href='#>К играм</a>
    </div>
    </div>
    `;
  }
}
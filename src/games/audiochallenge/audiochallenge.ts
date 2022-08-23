import './styles.scss';
import { StartPopUpLoyout, gameLoyout } from './create-html';

export default class AudioChallenge {
  group:number;

  element = document.createElement('section');

  constructor() {
    this.group = -1;
  }

  create():HTMLElement {
    this.element.classList.add('audio-challenge');
    const gameWrapper = '<div class="games-wrapper"></div>';
    this.element.innerHTML = gameWrapper;
    // если пришли с главной страницы
    this.drawGameLayout(StartPopUpLoyout);
    const btnLevels = <HTMLElement> this.element.getElementsByClassName('buttons-levels-wrapper')[0];
    btnLevels.addEventListener('click', (e: Event) => { this.handleLevelBtn(e); });
    return this.element;
  }

  drawGameLayout(HTMLLayout: string) {
    const gameWrapper = <HTMLElement> this.element.getElementsByClassName('games-wrapper')[0];
    gameWrapper.innerHTML = HTMLLayout;
  }

  handleLevelBtn(e: Event) {
    const elm = <HTMLElement>e.target;
    const arrayId = ['level1', 'level2', 'level3', 'level4', 'level5', 'level6'];
    this.group = arrayId.indexOf(elm.id);
    if (this.group !== -1) {
      this.group += 1;
      this.drawGameLayout(gameLoyout);
    }
  }
}

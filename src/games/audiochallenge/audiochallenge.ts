import './styles.scss';
import { StartPopUpLoyout, gameLoyout } from './create-html';

export default class AudioChallenge {
  group:number;

  constructor() {
    this.group = -1;
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
    }
  }
}

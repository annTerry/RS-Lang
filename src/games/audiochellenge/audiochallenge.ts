import './styles.scss';
import StartPopUpLoyout from './create-html';

export default class AudioChallenge {
  creat() {
    const main = <HTMLElement>document.querySelector('main');
    const gameWrapper = '<div class="games-wrapper"></div>';
    main.innerHTML = gameWrapper;
    // если пришли с главной страницы
    this.drawStartPopUp();
    const btnLevels = <HTMLElement>document.querySelector('.buttons-levels-wrapper');
    btnLevels.addEventListener('click', this.handleLevelBtn);
  }

  drawStartPopUp() {
    const gameWrapper = <HTMLElement>document.querySelector('.games-wrapper');
    gameWrapper.innerHTML = StartPopUpLoyout;
  }

  handleLevelBtn(e: Event) {
    const elm = <HTMLElement>e.target;
    console.log(elm.id);
    const popUp = <HTMLElement>document.querySelector('.games-popup');
    popUp.classList.add('hidden-style');
  }
}

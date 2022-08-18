import './styles.scss';
import { drawStart, drawStartPopUp } from './create-html';

function handleLevelBtn(e: Event) {
  const elm = <HTMLElement>e.target;
  console.log(elm.id);
  const startPopUp = <HTMLElement>document.querySelector('.games-popup');
  startPopUp.classList.add('hidden-style');
}

export default function audiochellenge() {
  drawStart();
  drawStartPopUp();
  const btnLevels = <HTMLElement>document.querySelector('.buttons-levels-wrapper');
  btnLevels.addEventListener('click', handleLevelBtn);
}

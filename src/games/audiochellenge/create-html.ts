const startPopUp = `<div class="games-popup">
<h3  class="games-popup__title">Аудиовызов</h3>
<div class="games-popup__text">
    <p> Вы должны выбрать перевод услышанного слова.</p>
    Чтобы играть с помощью клавиатуры, используй клавиши:
    <ul class="games-popup__list">
        <li>1, 2, 3, 4, 5 - чтобы дать ответ,</li>
        <li>space - для воспроизведения звука,</li>
        <li>enter - чтобы пропустить вопрос,</li>
        <li>&#10137 - чтобы перейти к следующему вопросу.</li>
    </ul>
    Выбери уровень сложности:
</div>
<div class="buttons-levels-wrapper">
   <button class="button-number  button-number_level-1" id="level1">1</button>
   <button class="button-number  button-number_level-2" id="level2">2</button>
   <button class="button-number  button-number_level-3" id="level3">3</button>
   <button class="button-number  button-number_level-4" id="level4">4</button>
   <button class="button-number  button-number_level-5" id="level5">5</button>
   <button class="button-number  button-number_level-6" id="level6">6</button>
</div>
</div>`;
export function drawStart() {
  const main = <HTMLElement>document.querySelector('main');
  const gameWrapper = '<div class="games-wrapper"></div>';
  main.innerHTML = gameWrapper;
}
export function drawStartPopUp() {
  const gameWrapper = <HTMLElement>document.querySelector('.games-wrapper');
  gameWrapper.innerHTML = startPopUp;
}

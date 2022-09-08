const StartPopUpLayout = `
  <div class="games-popup">
    <h3  class="games-popup__title">Спринт</h3>
    <div class="games-popup__text">
      <p class="games-popup__text text-center">Правильный ли перевод у слова?</p>
      <p>Чтобы играть с помощью клавиатуры, используй клавиши:</p>
      <ul class="games-popup__list">
        <li>&larr; - неверный перевод,</li>
        <li>&rarr; - перевод верный.</li>
      </ul>
    </div>
    <div class="text-center">Выбери уровень сложности:</div>
    <div class="buttons-levels-wrapper">
      <button class="button-number button-number_level-1" data-id="1">1</button>
      <button class="button-number button-number_level-2" data-id="2">2</button>
      <button class="button-number button-number_level-3" data-id="3">3</button>
      <button class="button-number button-number_level-4" data-id="4">4</button>
      <button class="button-number button-number_level-5" data-id="5">5</button>
      <button class="button-number button-number_level-6" data-id="6">6</button>
    </div>
  </div>`;

const gameLayout = `
  <div class="game-body">
    <div class="game-timer">0</div>
    <div class="game-question">
    </div>
  </div>`;

const questionLayout = `
  <div class="answer-img" id="answer-img"></div>
  <p class="game-answer text-center" id="answer"></p>
  <div class="btn-answer-wrapper">
   <button class="btn-answer" data-answer="false">&larr; Неверно</button>
   <button class="btn-answer" data-answer="true">Верно &rarr;</button>
  </div>`;

export { StartPopUpLayout, gameLayout, questionLayout };

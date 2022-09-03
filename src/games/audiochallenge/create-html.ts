const StartPopUpLayout = `<div class="games-popup">
<h3  class="games-popup__title">Аудиовызов</h3>
<div class="games-popup__text">
    <p class="games-popup__text">Вы должны выбрать перевод услышанного слова.</p>
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
const gameLayout = `<div class="game-body">
<ul class="game-lives">
   <li class="live-item"></li>
   <li class="live-item"></li>
   <li class="live-item"></li>
   <li class="live-item"></li>
   <li class="live-item"></li>
</ul>
<div class="game-question">
</div>
</div>`;
const questionLayout = `<div class="audio-wrapper" id="play-audio"></div>
  <div class="answer-img" id="answer-img"></div>
  <p class="game-answer hidden-style" id="answer"></p>
  <div class="btn-answer-wrapper">
   <button class="btn-answer" id="answer1"></button>
   <button class="btn-answer" id="answer2"></button>
   <button class="btn-answer" id="answer3"></button>
   <button class="btn-answer" id="answer4"></button>
   <button class="btn-answer" id="answer5"></button>
</div>
<button class="btn-next btn-primary btn" id="skip">Пропустить</button>
<button class="btn-next btn-primary btn conceal" id="next">Далее</button>`;

export { StartPopUpLayout, gameLayout, questionLayout };

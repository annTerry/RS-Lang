const liveSVG = `<svg width="31" height="29" viewBox="0 0 31 29" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M22.7656 0.816406C21.0835 0.816406 19.5412 1.34946 18.1818 2.4008C16.8785 3.40872 16.0108 4.6925 15.5 5.62601C14.9892 4.69244 14.1215 3.40872 12.8182 2.4008C11.4588 1.34946 9.91655 0.816406 8.23438 0.816406C3.54005 0.816406 0 4.65611 0 9.74792C0 15.2488 4.41647 19.0125 11.1024 24.7101C12.2378 25.6777 13.5247 26.7745 14.8623 27.9442C15.0386 28.0986 15.2651 28.1836 15.5 28.1836C15.7349 28.1836 15.9614 28.0986 16.1377 27.9443C17.4754 26.7744 18.7623 25.6777 19.8983 24.7095C26.5835 19.0125 31 15.2488 31 9.74792C31 4.65611 27.4599 0.816406 22.7656 0.816406Z" fill="red"></path>
</svg>`;
const StartPopUpLoyout = `<div class="games-popup">
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
const gameLoyout = `<div class="game-body">
<div class="game-lives">
   <div class="live-item">
   ${liveSVG}
   </div>
   <div class="live-item">
   ${liveSVG}
   </div>
   <div class="live-item">
   ${liveSVG}
   </div>
   <div class="live-item">
   ${liveSVG}
   </div>
   <div class="live-item">
   ${liveSVG}
   </div>
</div>
<div class="audio-wrapper" id="play-audio">
</div>
<p class="game-answer" id="answer">Правильный ответ</p>
<div class="btn-answer-wrapper">
   <button class="btn-answer" id="answer1">1. ответ</button>
   <button class="btn-answer" id="answer2">2. ответ</button>
   <button class="btn-answer" id="answer3">3. ответ</button>
   <button class="btn-answer" id="answer4">4. ответ</button>
   <button class="btn-answer" id="answer5">5. ответ</button>
</div>
<button class="btn-skip" id="skip">Пропустить</button>
</div>
</div>`;
export { StartPopUpLoyout, gameLoyout };

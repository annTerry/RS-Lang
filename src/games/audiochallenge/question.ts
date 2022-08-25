import { TWordSimple } from '../../common/baseTypes';
import { DATABASE_LINK } from '../../common/constants';

const ANSEWERS_COUNT = 5;

export default class Question {
  isCorrect : boolean;

  word : TWordSimple;

  answers: string[];

  idTrueAnswer: string;

  constructor(word : TWordSimple, answers: string[]) {
    this.word = word;
    this.isCorrect = false;
    this.answers = answers;
    this.idTrueAnswer = '';
  }

  render() {
    // подсказка
    const answerText = <HTMLElement>document.getElementById('answer');
    answerText.innerText = `${this.word.word} ${this.word.transcription}`;
    // звук
    const playAudioBtn = <HTMLElement>document.getElementById('play-audio');
    playAudioBtn.addEventListener('click', () => { this.play(); });
    this.play();
    // правильный ответ
    this.getTrueAnswer();
    // случайные ответы
    this.renderAnswers();
    // слушаем ответ
    const btnAnswersContener = <HTMLElement>document.querySelector('.btn-answer-wrapper');
    btnAnswersContener.addEventListener('click', (e) => { this.handleAnswersBtn(e); });
    document.addEventListener('keydown', (e) => { this.handleAnswerKeyboard(e); });
  }

  play() {
    const audio = new Audio();
    audio.src = `${DATABASE_LINK}/${this.word.audio}`;
    audio.play();
  }

  getTrueAnswer() {
    this.idTrueAnswer = `answer${Math.floor(Math.random() * ANSEWERS_COUNT) + 1}`;
    (<HTMLElement>document.getElementById(this.idTrueAnswer)).innerText = this.word.wordTranslate;
  }

  renderAnswers() {
    const btnAnswersList = document.querySelectorAll('.btn-answer');
    let btnAnswersArray = Array.prototype.slice.call(btnAnswersList);
    // случайные ответы
    btnAnswersArray = btnAnswersArray.filter((btn) => (btn.id !== this.idTrueAnswer));
    this.answers.forEach((value, index) => { btnAnswersArray[index].innerText = value; });
  }

  showPicture() {
    const playAudioBtn = <HTMLElement>document.getElementById('play-audio');
    playAudioBtn.classList.add('conceal');
    const answerImg = <HTMLElement>document.getElementById('answer-img');
    answerImg.style.backgroundImage = `url(${DATABASE_LINK}/${this.word.image})`;
    answerImg.classList.add('answer-img_active');
  }

  showAnswers() {
    const arrayId = ['answer1', 'answer2', 'answer3', 'answer4', 'answer5'];
    arrayId.forEach((itemId) => {
      const btnItem = <HTMLInputElement>document.getElementById(itemId);
      btnItem.disabled = true;
      if (itemId === this.idTrueAnswer) {
        btnItem.classList.add('btn-answer_true');
      } else {
        btnItem.classList.add('btn-answer_false');
      }
    });
    // показать ответ
    const answerText = <HTMLElement>document.getElementById('answer');
    answerText.classList.remove('hidden-style');
    // изменить кнопку
    this.changeBtns();
    // показать картинку
    this.showPicture();
  }

  handleAnswersBtn(e:Event) {
    const elm = <HTMLElement>e.target;
    if (elm.id) {
      this.showAnswers();
      // проверка ответа
      this.checkAnswer(elm.id);
    }
  }

  handleAnswerKeyboard(e:KeyboardEvent) {
    if ((e.key === '1') || (e.key === '2') || (e.key === '3') || (e.key === '4') || (e.key === '5')) {
      e.preventDefault();
      this.showAnswers();
      console.log(`answer${e.key}`);
      this.checkAnswer(`answer${e.key}`);
    }
  }

  checkAnswer(id: string) {
    if (id === this.idTrueAnswer) this.isCorrect = true;
  }

  changeBtns() {
    const skipBtn = <HTMLElement>document.getElementById('skip');
    skipBtn.classList.add('conceal');
    const nextBtn = <HTMLElement>document.getElementById('next');
    nextBtn.classList.remove('conceal');
  }
}

import { TWordSimple } from '@common/baseTypes';

export default class Question {
  words: TWordSimple[];
  isTrueAnswer: boolean;
  isCorrect: boolean;

  constructor(words: TWordSimple[]) {
    this.words = words;
    this.isTrueAnswer = false;
    this.isCorrect = false;
  }

  render() {
    // установка правильного ответа
    this.getTrueAnswer();
    // слово и предлагаемый перевод
    this.renderWord();
  }

  getTrueAnswer() {
    const idx = Math.round(Math.random());
    this.isTrueAnswer = idx === 0;
  }

  renderWord() {
    const answerText = <HTMLElement>document.getElementById('answer');
    answerText.innerHTML = `${this.words[0].word}<br>${this.words[Number(!this.isTrueAnswer)].wordTranslate}`;
  }

  checkAnswer(answer: boolean) {
    if (answer === this.isTrueAnswer) {
      this.isCorrect = true;
    }
  }
}

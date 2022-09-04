import Store from '@src/store/store';
import './statistics.scss';
import { getUserStatistic } from '../../api/userStatistic';
import isDataToday from '../../helpers';
import { TUserStatistic } from '../../common/baseTypes';

export default class Statistics {
  element = document.createElement('section');

  store : Store;

  constructor(store:Store) {
    this.store = store;
  }

  create():HTMLElement {
    this.element.classList.add('statistics');
    if (this.store.getAuthorized()) {
      console.log('авторизованный пользователь');
      this.getAuth();
    } else {
      console.log('статистика не доступна не авторизованному пользователю');
      this.getNoAuth();
    }
    return this.element;
  }

  getNoAuth() {
    const html = `
    <h2 class="title"> Cтатистика </h2>
    <p>Пожалуйста, авторизуйтесь или зарегистрируйтесь для просмотра данной страницы </p>
    <div class="no-auth-img" ></div>
    `;
    this.element.innerHTML = html;
  }

  async getAuth() {
    const user = this.store.getUser();
    let statistic = await getUserStatistic(user.id, user.token);
    console.log('statistic', statistic);
    if ((!statistic) || (!isDataToday(statistic.optional.date))) {
      statistic = {
        learnedWords: 0,
        optional: {
          date: new Date().toLocaleDateString(),
          audioChallenge: {
            correctAnswers: 0,
            wrongAnswers: 0,
            series: 0,
            newWords: 0,
          },
        },
      };
    }
    this.renderHTML(statistic);
  }

  renderHTML(statistic: TUserStatistic) {
    const html = `
    <h2 class="title">Статистика</h2>
    <h3 class="sub-title">Общая статистика за день</h3>

    <div class="statistics-card">
      <div class="statistics-item">
        <div class="item-text">Количество изученных слов за день:</div>
        <div class="item-result">${statistic.learnedWords}</div>
      </div>
      <div class="statistics-item">
        <div class="item-text">Количество новых слов за день:</div>
        <div class="item-result">${statistic.optional.audioChallenge.newWords}</div>
      </div>
      <div class="statistics-item">
        <div class="item-text">Процент правильных ответов за день:</div>
        <div class="item-result"> ${this.сalculatePercentage(statistic.optional.audioChallenge.correctAnswers, statistic.optional.audioChallenge.wrongAnswers)}</div>
      </div>
    </div>

    <h3 class="sub-title">Статистика по играм</h3>

    <div class="statistics-card">
    <h4 class="sub-title">Аудиовызов</h4>
      <div class="statistics-item">
        <div class="item-text">Количество новых слов:</div>
        <div class="item-result">${statistic.optional.audioChallenge.newWords}</div>
      </div>
      <div class="statistics-item">
        <div class="item-text">Процент правильных ответов:</div>
        <div class="item-result">${this.сalculatePercentage(statistic.optional.audioChallenge.correctAnswers, statistic.optional.audioChallenge.wrongAnswers)}</div>
      </div>
      <div class="statistics-item">
        <div class="item-text">Самая длинная серия правильных ответов:</div>
        <div class="item-result">${statistic.optional.audioChallenge.series}</div>
      </div>
    </div>

    <div class="statistics-card">
    <h4 class="sub-title">Спринт</h4>
      <div class="statistics-item">
        <div class="item-text">Количество новых слов:</div>
        <div class="item-result"></div>
      </div>
      <div class="statistics-item">
        <div class="item-text">Процент правильных ответов:</div>
        <div class="item-result"></div>
      </div>
      <div class="statistics-item">
        <div class="item-text">Самая длинная серия правильных ответов:</div>
        <div class="item-result"></div>
      </div>
    </div>`;
    this.element.innerHTML = html;
  }

  сalculatePercentage(correct:number, inCorrect: number) {
    const result = Math.round((correct / (correct + inCorrect)) * 100);
    return (!result) ? 0 : result;
  }
}

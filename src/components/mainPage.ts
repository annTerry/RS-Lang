import './main.scss';
import Store from '@src/store/store';

export default class MainPage {
  element: HTMLElement;

  store: Store;

  constructor(store:Store, styleClass = 'main') {
    this.element = document.createElement('section');
    this.element.classList.add(styleClass);
    this.element.innerHTML = this.applicationInfo();
    this.element.innerHTML += this.usersInfo();
    this.store = store;
  }

  applicationInfo():string {
    return `<section class='about-section'>Электронная версия учебника, 
    помогающая в игровой форме изучить 3600 английских слов, и помочь лучше воспринимать их на слух. Учебник можно использовать и без регистранции,
    но с регистрацией можно отслеживать статистику, следить за своими успехами и отмечать сложные слова.
</section>
`;
  }

  usersInfo():string {
    return `<section class='users-section'>
    <div class="author"><a href="https://github.com/annTerry" target="_blank" class='link-header'>annTerry</a>
      <div class='author-description annTerry-img'>
        <p>Team-lead, учебник, главная страница, список слов, навигация</p>
      </div>
    </div>
    <div class="author"><a href="https://github.com/AlexOlga" target="_blank" class='link-header'>AlexOlga</a>
      <div class='author-description AlexOlga-img'>
        <p>Игра Аудиочелендж, статистика</p>
      </div>
    </div>
    <div class="author"><a href="https://github.com/juliv" target="_blank" class='link-header'>juliv</a>
    <div class='author-description juliv-img'>
      <p>Авторизация, дизайн, меню и футер, игра Спринт</p>
    </div>
  </div>   
</section>
`;
  }

  create():HTMLElement {
    return this.element;
  }
}

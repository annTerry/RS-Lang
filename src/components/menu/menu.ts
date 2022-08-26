import Store from 'src/store/store';
import './menu.scss';

type MenuItem = {
  name: string,
  link: string
};

export default class Menu {
  store:Store;

  constructor(store: Store) {
    this.store = store;
    this.create();
  }

  // Список пунктов меню
  items: Array<MenuItem> = [
    { name: 'Учебник', link: '#Textbook' },
    { name: 'Аудиочелендж', link: '#AudioChallenge' },
    { name: 'Спринт', link: '' },
    { name: 'Статистика', link: '' },
  ];

  /**
   * Создание html
   */
  create(): void {
    const menu = document.querySelector('.js-menu') as HTMLElement;
    menu.insertAdjacentHTML('afterbegin', `
      <ul class="menu__ul">
        ${this.renderLinks()}
      </ul>
    `);
    const links = document.getElementsByTagName('a');
    for (let j = 0; j < links.length; j += 1) {
      links[j].addEventListener('click', () => {
        let clearLink = links[j].getAttribute('href') || '';
        clearLink = clearLink.replace('#', '');
        this.store.setCurrentPage(clearLink);
      });
    }
  }

  /**
   * Рендер пунктов меню
   */
  renderLinks(): string {
    return this.items.reduce(
      (acc: string, item: MenuItem) => `${acc} <li><a href="${item.link}">${item.name}</a></li>`,
      '',
    );
  }
}

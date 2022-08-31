import Store from 'src/store/store';
import Router from '@src/api/router';
import './menu.scss';

type MenuItem = {
  name: string,
  link: string
};

export default class Menu {
  store:Store;

  router:Router;

  constructor(store: Store, router: Router) {
    this.store = store;
    this.router = router;
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
        const linkHref = links[j].getAttribute('href') as string;
        this.router.setNewPage(Router.newPageName(linkHref));
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

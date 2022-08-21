import './menu.scss';

type MenuItem = {
  name: string,
  link: string
};

export default class Menu {
  constructor() {
    this.create();
  }

  // Список пунктов меню
  items: Array<MenuItem> = [
    { name: 'Учебник', link: '' },
    { name: 'Мини-игры', link: '' },
    { name: 'Статистика', link: '' },
  ];

  /**
   * Создание html
   */
  create(): void {
    (document.querySelector('.js-menu') as HTMLElement).insertAdjacentHTML('afterbegin', `
      <ul class="menu__ul">
        ${this.renderLinks()}
      </ul>
    `);
  }

  /**
   * Рендер пунктов меню
   */
  renderLinks(): string {
    return this.items.reduce(
      (acc: string, item: MenuItem) =>
        `${acc} <li><a href="${item.link}">${item.name}</a></li>`,
      '',
    );
  }
}

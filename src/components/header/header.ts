import './header.scss';
import { TITLE } from '@common/constants';
import Router from '@src/api/router';
import Store from '../../store/store';
import Menu from '../menu/menu';

export default class Header {
  menu: Menu;

  constructor(store: Store, router: Router) {
    this.create();
    this.menu = new Menu(store, router);
  }

  /**
   * Создание html
   */
  create(): void {
    document.body.insertAdjacentHTML('afterbegin', `
      <header class="header">
        <div class="container header__in">

          <div class="logo">
            <a href="/RS-Lang">${TITLE}</a>
          </div>

          <nav class="menu js-menu"></nav>

          <div class="auth js-auth-link"></div>

        </div>
      </header>`);
  }
}

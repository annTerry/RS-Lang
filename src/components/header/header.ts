import './header.scss';
import { TITLE } from '@common/constants';
import Store from '../../store/store';
import Menu from '../menu/menu';

export default class Header {
  menu: Menu;

  constructor(store: Store) {
    this.create();
    this.menu = new Menu(store);
  }

  /**
   * Создание html
   */
  create(): void {
    document.body.insertAdjacentHTML('afterbegin', `
      <header class="header">
        <div class="container header__in">

          <div class="logo">
            <a href="/">${TITLE}</a>
          </div>

          <nav class="menu js-menu"></nav>

          <div class="auth">
            <button type="button" class="btn btn-outline-primary">Войти</button>
          </div>

        </div>
      </header>`);
  }
}

import './auth.scss';
import { formsHtml, linksHtml } from './html';
import Modal from '@components/modal/modal';
import { DATABASE_LINK } from '@common/constants';
import Store from '../../store/store';
import { TAlertType, TErrorMessage } from '@common/baseTypes';

export default class Auth {
  modal: Modal | null;
  formLogin: HTMLElement | null;
  formRegister: HTMLElement | null;
  alertForm: HTMLElement | null;
  authLinks: HTMLElement | null;
  store: Store;

  constructor(store: Store) {
    this.formLogin = null;
    this.formRegister = null;
    this.alertForm = null;
    this.authLinks = null;
    this.store = store;

    this.modal = new Modal(
      'Авторизация',
      formsHtml,
      {
        css: 'modal_auth'
      })
    this.createLinks();
    this.addEvents();
    this.switchAuth();
  }

  createLinks(): void {
    this.authLinks = document.querySelector('.js-auth-link') as HTMLElement;
    this.authLinks.innerHTML = linksHtml;

    this.formLogin = this.modal?.modal?.querySelector('.js-form-login') as HTMLElement;
    this.formRegister = this.modal?.modal?.querySelector('.js-form-register') as HTMLElement;
    this.alertForm = this.modal?.modal?.querySelector('.js-alert-auth') as HTMLElement;
  }

  addEvents() {
    const linkOpen = this.authLinks?.querySelector('.js-link-auth-open') as HTMLElement;
    linkOpen.addEventListener('click', () => {
      this.alert();
      this.modal?.open();
    });
    const linkLogout = this.authLinks?.querySelector('.js-link-logout') as HTMLElement;
    linkLogout.addEventListener('click', () => {
      this.logout();
    });

    const linkToRegister = this.formLogin?.querySelector('.js-link-to-register') as HTMLElement;
    linkToRegister.addEventListener('click', (e) => {
      this.switchForm('register');
      e.preventDefault();
    });
    const linkToAuth = this.formRegister?.querySelector('.js-link-to-auth') as HTMLElement;
    linkToAuth.addEventListener('click', (e) => {
      this.switchForm('login');
      e.preventDefault();
    });

    this.formLogin?.addEventListener('submit', (e) => {
      this.login();
      e.preventDefault();
    });
    this.formRegister?.addEventListener('submit', (e) => {
      this.register();
      e.preventDefault();
    });
  }

  // Подготовка текста для сообщения
  alertPrepare(text: TErrorMessage[] | string = ''): string {
    if (Array.isArray(text) && text.length) {
      const items = text.map(item => item.message);
      return (items.length > 1)
        ? `<ul><li>${items.join('</li><li>')}</li></ul>`
        : items.join('');
    }
    return text ? (text as string) : '';
  }

  // Вывод сообщения
  alert(text: string | TErrorMessage[] = '', type: TAlertType = 'success'): void {
    if (!(this.alertForm instanceof HTMLElement)) return;
    const message = this.alertPrepare(text);
    if (message) {
      this.alertForm.classList.remove('hide');
      this.alertForm.innerHTML = `<div class="alert alert_${type}">${message}</div>`;
    }
    else {
      this.alertForm.classList.add('hide');
      this.alertForm.innerHTML = '';
    }
  }

  // Переключение на активную форму
  switchForm(type: 'login' | 'register'): void {
    if (!(this.modal instanceof Modal)) return;
    this.alert();
    if (type === 'login') {
      this.modal.title = 'Авторизация';
      (this.formLogin as HTMLElement).classList.remove('hide');
      (this.formRegister as HTMLElement).classList.add('hide');
      (this.formLogin as HTMLFormElement).reset();
    } else if (type === 'register') {
      this.modal.title = 'Регистрация';
      (this.formLogin as HTMLElement).classList.add('hide');
      (this.formRegister as HTMLElement).classList.remove('hide');
      (this.formRegister as HTMLFormElement).reset();
    }
  }

  // Переключение статуса авторизован / не авторизован
  switchAuth() {
    const wrap = document.querySelector('.js-auth-link') as HTMLElement;
    const username = wrap.querySelector('.js-username') as HTMLElement;
    const linkOpen = wrap.querySelector('.js-link-auth-open') as HTMLElement;
    const linkLogout = wrap.querySelector('.js-link-logout') as HTMLElement;

    if (this.store.getAuthorized()) {
      linkOpen.classList.add('hide');
      linkLogout.classList.remove('hide');
      username.classList.remove('hide');
    }
    else {
      linkOpen.classList.remove('hide');
      username.classList.add('hide');
      linkLogout.classList.add('hide');
    }

    const user = this.store.getUser();
    username.innerText = user.name || '';
  }

  register() {
    if (!(this.formRegister instanceof HTMLFormElement)) return;
    let formData = Object.fromEntries(new FormData(this.formRegister).entries());
    fetch(`${DATABASE_LINK}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.text())
      .then(text => {
        try {
          console.log('txt', text);
          const data = JSON.parse(text);
          if ('error' in data) {
            const { errors = [] } = data.error;
            this.alert(errors, 'danger');
          } else {
            (this.formRegister as HTMLFormElement).reset();
            this.switchForm('login');
            this.alert('Вы успешно зарегистрировались. Пожалуйста, авторизуйтесь.', 'success');
          }
        } catch(err) {
          this.alert(text, 'danger');
        }
      });
  }

  login() {
    if (!(this.formLogin instanceof HTMLFormElement)) return;
    let formData = Object.fromEntries(new FormData(this.formLogin).entries());
    fetch(`${DATABASE_LINK}/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.text())
      .then(text => {
        try {
          const data = JSON.parse(text);
          const { userId, name, token } = data;
          this.store.setAuthorized(userId, name, token);
          this.switchAuth();
          (this.formLogin as HTMLFormElement).reset();
          this.modal?.close();
        } catch(err) {
          this.alert(text, 'danger');
        }
      });
  }

  logout() {
    this.store.setAuthorized('', '');
    this.switchAuth();
  }

}

import './auth.scss';
import Modal from '@components/modal/modal';

export default class Auth {
  modal: Modal | null;
  formAuth: HTMLElement | null;
  formRegister: HTMLElement | null;

  constructor() {
    this.formAuth = null;
    this.formRegister = null;

    this.modal = new Modal(
      'Авторизация',
      this.formHtml(),
      {
        css: 'modal_auth'
      })
    this.createLink();
  }

  formHtml(): string {
    return `
      <!-- Форма авторизации -->
      <form class="js-form-auth">
        <div class="form-wrapper">
          <input type="email" class="form-control" id="auth-email" placeholder="Электронная почта" required>
          <label for="auth-email" class="hide">Электронная почта</label>
        </div>
        <div class="form-wrapper">
          <input type="password" class="form-control" id="auth-password" placeholder="Пароль" required>
          <label for="auth-password" class="hide">Пароль</label>
        </div>
        <div class="form-wrapper">
          <button class="btn btn-primary w-100" type="submit">Войти</button>
        </div>
        <div class="form-wrapper text-center">
          <a href="" class="js-link-to-register">Регистрация</a>
        </div>
      </form>
      <!-- Форма регистрации -->
      <form class="js-form-register hide">
        <div class="form-wrapper">
          <input type="text" class="form-control" id="register-email" placeholder="Ваше имя" required>
          <label for="register-email" class="hide">Ваше имя</label>
        </div>
        <div class="form-wrapper">
          <input type="email" class="form-control" id="register-email" placeholder="Электронная почта" required>
          <label for="register-email" class="hide">Электронная почта</label>
        </div>
        <div class="form-wrapper">
          <input type="password" class="form-control" id="register-password" placeholder="Пароль" required>
          <label for="register-password" class="hide">Пароль</label>
        </div>
        <div class="form-wrapper">
          <button class="btn btn-primary w-100" type="submit">Зарегистрироваться</button>
        </div>
        <div class="form-wrapper text-center">
          <a href="" class="js-link-to-auth">Авторизация</a>
        </div>
      </form>`;
  }

  createLink(): void {
    const wrap = document.querySelector('.js-auth-link') as HTMLElement;
    wrap.innerHTML = `<button type="button" class="btn btn-primary js-link-auth-open">Войти</button>`;

    const linkOpen = wrap.querySelector('.js-link-auth-open') as HTMLElement;
    linkOpen.addEventListener('click', () => {
      this.modal?.open();
    });

    this.formAuth = document.querySelector('.js-form-auth') as HTMLElement;
    this.formRegister = document.querySelector('.js-form-register') as HTMLElement;

    const linkToRegister = document.querySelector('.js-link-to-register') as HTMLElement;
    linkToRegister.addEventListener('click', (e) => {
      this.switchForm('register');
      e.preventDefault();
    });

    const linkToAuth = document.querySelector('.js-link-to-auth') as HTMLElement;
    linkToAuth.addEventListener('click', (e) => {
      this.switchForm('auth');
      e.preventDefault();
    });
  }

  // Переключение на активную форму
  switchForm(type: 'auth' | 'register'): void {
    if (!(this.modal instanceof Modal)) return;
    if (type === 'auth') {
      this.modal.title = 'Авторизация';
      (this.formAuth as HTMLElement).classList.remove('hide');
      (this.formRegister as HTMLElement).classList.add('hide');
    } else if (type === 'register') {
      this.modal.title = 'Регистрация';
      (this.formAuth as HTMLElement).classList.add('hide');
      (this.formRegister as HTMLElement).classList.remove('hide');
    }
  }

}

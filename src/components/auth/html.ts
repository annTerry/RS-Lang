const formsHtml = `
  <div class="js-alert-auth"></div>
  <!-- Форма авторизации -->
  <form class="js-form-login">
    <div class="form-wrapper">
      <input type="email" name="email" class="form-control" id="auth-email" placeholder="Электронная почта" value="" required>
      <label for="auth-email" class="hide">Электронная почта</label>
    </div>
    <div class="form-wrapper">
      <input type="password" name="password" class="form-control" id="auth-password" placeholder="Пароль" value="" required>
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
      <input type="text" name="name" class="form-control" id="register-email" placeholder="Ваше имя" required>
      <label for="register-email" class="hide">Ваше имя</label>
    </div>
    <div class="form-wrapper">
      <input type="email" name="email" class="form-control" id="register-email" placeholder="Электронная почта" required>
      <label for="register-email" class="hide">Электронная почта</label>
    </div>
    <div class="form-wrapper">
      <input type="password" name="password" class="form-control" id="register-password" placeholder="Пароль" required>
      <label for="register-password" class="hide">Пароль</label>
    </div>
    <div class="form-wrapper">
      <button class="btn btn-primary w-100" type="submit">Зарегистрироваться</button>
    </div>
    <div class="form-wrapper text-center">
      <a href="" class="js-link-to-auth">Авторизация</a>
    </div>
  </form>`;

const linksHtml = `
  <span class="username js-username hide"></span>
  <button class="btn btn-primary js-link-auth-open hide">Войти</button>
  <button class="btn btn-primary js-link-logout hide">Выйти</button>`;

export {
  formsHtml,
  linksHtml,
};

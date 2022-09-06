import './footer.scss';
import { TITLE } from '@common/constants';
// @ts-ignore
import rsSchoolImg from '@assets/images/rs_school_js.svg';

export default class Footer {
  constructor() {
    this.create();
  }

  // Список авторов проекта
  authors: Array<string> = [
    'annTerry',
    'AlexOlga',
    'juliv',
  ];

  /**
   * Создание html
   */
  create(): void {
    document.body.insertAdjacentHTML('beforeend', `
      <footer class="footer">
        <div class="container footer__in">
          <div class="footer__copy">&copy; ${new Date().getFullYear()} ${TITLE}</div>
          <div class="footer__authors">
            <ul>
              ${this.renderAuthors()}
            </ul>
          </div>
          <div class="footer__rs-school">
            <a href="https://rs.school/js/" target="_blank">
            <img src="${rsSchoolImg}" alt="RS School JS" class="footer__rs-school__img">
            </a>
          </div>
        </div>
      </footer>`);
  }

  /**
   * Рендер списка авторов
   */
  renderAuthors(): string {
    return this.authors.reduce(
      (acc: string, item: string) =>
        `${acc} <li><a href="https://github.com/${item}" target="_blank"><i class="ico_github"></i> ${item}</a></li>`,
      '',
    );
  }
}

import './modal.scss';

type ModalOptions = {
  css?: string,
};

export default class Modal {
  modal: HTMLElement | null;
  overlay: HTMLElement | null;
  modalClose: HTMLElement | null;
  isOpen: boolean;

  private _title: string = '';

  constructor(title: string, body: string, options: ModalOptions = {}) {
    this.modal = null;
    this.overlay = null;
    this.modalClose = null;
    this.isOpen = false;

    this.create(title, body, options);
    this.createOverlay();
  }

  // Модальное окно
  create(title: string, body: string, options: ModalOptions): void {
    this.title = title;
    const {
      css = ''
    } = options;
    document.body.insertAdjacentHTML('beforeend', `
      <div class="modal ${css}">
        <div class="modal__header">
          <h2 class="modal__title">${title}</h2>
          <button class="modal__close btn-close" title="Закрыть">✕</button>
        </div>
        <div class="modal__body">
          ${body}
        </div>
      </div>`);
    this.modal = document.querySelector('.modal:last-child') as HTMLElement;

    this.modalClose = this.modal.querySelector('.modal__close') as HTMLElement;
    this.modalClose.addEventListener('click', () => {
      this.close();
    });
  }

  // Оверлей
  createOverlay(): void {
    const css = 'modal__overlay';
    // Создаём только один оверлей
    if (document.querySelector(`.${css}`) === null) {
      document.body.insertAdjacentHTML('beforeend', `<div class="${css} hide"></div>`);
    }
    this.overlay = document.querySelector(`.${css}`) as HTMLElement;
  }

  get title(): string {
    return this._title;
  }

  set title(title: string) {
    this._title = title;
    if (this.modal instanceof HTMLElement) {
      (this.modal.querySelector('.modal__title') as HTMLElement).innerHTML = title;
    }
  }

  open(): void {
    this.isOpen = true;
    this.overlay?.classList.remove('hide');
    this.modal?.classList.add('open');
  }

  close(): void {
    this.isOpen = false;
    this.overlay?.classList.add('hide');
    this.modal?.classList.remove('open');
  }
}

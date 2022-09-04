import {
  PagesCategory, TStoreBase, TPage, StoreCallbackFunction,
  TPageAndPart,
} from '@common/baseTypes';

export default class Store {
  private store:TStoreBase;

  private watchers:{ [event:string]: Array<StoreCallbackFunction> };

  constructor() {
    this.store = {
      uid: this.getItem('uid', ''),
      username: this.getItem('username', ''),
      token: this.getItem('token', ''),
      currentPage: { page: PagesCategory.Main },
    };
    this.watchers = {};
  }

  getItem(key: string, defaultValue: string): string {
    const value = localStorage.getItem(key);
    return value !== null ? value : defaultValue;
  }

  getTextBookPage():TPageAndPart {
    return this.store.textBook || {};
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  addWatcher(action:string, fn: StoreCallbackFunction):void {
    if (!this.watchers[action]) this.watchers[action] = [];
    this.watchers[action].push(fn);
  }

  resolveWatchers(action:string) {
    const currentWatcher = this.watchers[action];
    if (currentWatcher) { for (let i = 0; i < currentWatcher.length; i += 1) currentWatcher[i](); }
  }

  getCurrentPage():TPage {
    return this.store.currentPage;
  }

  getCurrentPageName():string {
    return this.store.currentPage.page;
  }

  getCurrentPageNumber():number {
    return this.store.currentPage.number || 0;
  }

  getCurrentPartNumber():number {
    return this.store.currentPage.part || 0;
  }

  getUser() {
    return {
      id: this.store.uid,
      name: this.store.username,
      token: this.store.token || '',
    };
  }

  getAuthorized():boolean {
    return !!this.store.uid;
  }

  async setWords(resolve = 'simple') {
    if (this.store.uid !== '') {
      this.store.words = {};
    } else {
      this.store.words = {};
    }
    if (resolve === 'authorize') {
      this.resolveWatchers('Authorize');
    }
  }

  setAuthorized(uid: string, username: string, token?: string) {
    try {
      if (typeof token !== 'string' || !token || !uid) {
        this.store.uid = '';
        delete this.store.username;
        delete this.store.token;
        this.setItem('uid', '');
        this.removeItem('username');
        this.removeItem('token');
      } else {
        this.store.uid = uid;
        this.store.username = username;
        this.store.token = token;
        this.setItem('uid', uid);
        this.setItem('username', username);
        this.setItem('token', token);
      }
      this.setWords('authorize');
    } catch (e) {
      console.error('Wrong Authorization params');
    }
  }

  setCurrentTextBook(part = 0, number = 0) {
    if (this.store.textBook === undefined) { this.store.textBook = {}; }
    this.store.textBook.number = number;
    this.store.textBook.part = part;
    this.resolveWatchers('TextBook');
  }

  setCurrentPage(page:string, part?:number, number?:number) {
    const newPage:PagesCategory = PagesCategory[page as keyof typeof PagesCategory];
    this.store.currentPage.page = newPage;
    if (number !== undefined) this.store.currentPage.number = number;
    if (part !== undefined) this.store.currentPage.part = part;
    this.resolveWatchers('currentPage');
  }
}

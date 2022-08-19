import { PagesCategory, TStoreBase, TPage } from '../common/baseTypes';

export default class Store {
  private store:TStoreBase;

  constructor() {
    this.store = {
      authorization: false,
      currentPage: { page: PagesCategory.Main },
    };
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

  getAuthorized():boolean {
    return this.store.authorization;
  }

  setAuthorized(authorization:boolean, token?:string) {
    try {
      if (token === 'undefined') {
        if (authorization) throw new Error();
        else {
          this.store.authorization = false;
          this.store.token = undefined;
        }
      } else {
        this.store.authorization = authorization;
        this.store.token = token;
      }
    } catch (e) {
      console.log('Wrong Authorization params');
    }
  }

  setCurrentPage(page:string, number?:number) {
    const newPage:PagesCategory = PagesCategory[page as keyof typeof PagesCategory];
    this.store.currentPage.page = newPage;
    if (number !== undefined) this.store.currentPage.number = number;
  }
}

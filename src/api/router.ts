import Store from '../store/store';
// import { PagesCategory, TPage } from '../common/baseTypes';

export default class Router {
  store:Store;

  constructor(store:Store, pageName = 'Main', pageNumber?:number) {
    this.store = store;
    this.store.setCurrentPage(this.newPageName(pageName), pageNumber);
  }

  setNewPage() {
    const newPage = this.newPageName();
    this.newPage(newPage);
  }

  newPageName(pageName = 'Main') {
    const urlPageName = window.location.hash || pageName;
    return urlPageName.replace('#', '');
  }

  newPage(pageName:string, pageNumber?:number) {
    this.store.setCurrentPage(pageName, pageNumber);
  }
}

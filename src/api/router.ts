import Store from '../store/store';
// import { PagesCategory, TPage } from '../common/baseTypes';

export default class Router {
  store:Store;

  constructor(store:Store, pageName = 'Main', pageNumber?:number) {
    this.store = store;
    this.store.setCurrentPage(pageName, pageNumber);
  }

  newPage(pageName:string, pageNumber?:number) {
    this.store.setCurrentPage(pageName, pageNumber);
  }
}

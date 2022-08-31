import Store from '../store/store';
import { TPageAndPart } from '../common/baseTypes';

export default class Router {
  store:Store;

  constructor(store:Store, pageName = 'Main') {
    this.store = store;
    this.setNewPage(pageName);
  }

  setNewPage(pageName = 'Main', partNumber?:number, pageNumber?:number) {
    const partAndPage = Router.getPartAndPage(partNumber, pageNumber);
    this.store.setCurrentPage(Router.newPageName(pageName), partAndPage.part, partAndPage.number);
  }

  static getPartAndPage(partNumber?:number, pageNumber?:number):TPageAndPart {
    const data:TPageAndPart = { part: partNumber, number: pageNumber };
    if (partNumber !== undefined) {
      const queryStr = window.location.hash;
      if (queryStr.includes('_')) {
        const queryStrParams = queryStr.split('_');
        if (queryStrParams.length > 1) data.part = +queryStrParams[1];
        if (queryStrParams.length > 2) data.number = +queryStrParams[2];
      }
    }
    return data;
  }

  static newPageName(pageName = 'Main') {
    const urlPageName = window.location.hash || pageName;
    return urlPageName.replace('#', '');
  }

  newPage(pageName:string, partNumber?:number, pageNumber?:number) {
    this.store.setCurrentPage(pageName, partNumber, pageNumber);
  }
}

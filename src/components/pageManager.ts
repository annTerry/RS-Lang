import Router from '../api/router';
import AudioChallenge from '../games/audiochallenge/audiochallenge';
import Store from '../store/store';
import MainPage from './mainPage';
import Textbook from './textbook/textBook';

const PAGES_TYPES = {
  Main: MainPage,
  AudioChallenge,
  Textbook,
};

type TPageClass = { [key:string]: AudioChallenge | MainPage | Textbook } | undefined;

export default class PageManager {
  store:Store;

  router:Router;

  pageClass: TPageClass;

  mainElement: HTMLElement;

  constructor(store:Store, router:Router) {
    this.store = store;
    this.router = router;
    this.pageClass = this.setPages();
    this.mainElement = document.createElement('main');
    document.body.append(this.mainElement);
    store.addWatcher('currentPage', () => { this.resetPage(); });
    this.resetPage();
  }

  resetPage() {
    const currentPage = this.store.getCurrentPageName();
    const currentClass = this.pageClass && this.pageClass[currentPage];
    this.mainElement.innerHTML = '';
    if (currentClass) {
      this.mainElement.append(currentClass.create());
    } else {
      console.log('Wrong Page');
    }
  }

  setPages():TPageClass {
    const pageObj:TPageClass = {};
    Object.entries(PAGES_TYPES).forEach((entry) => {
      const currentType = entry[0] as string;
      pageObj[currentType] = new entry[1](this.store);
    });
    return pageObj;
  }
}

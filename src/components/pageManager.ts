import Router from '../api/router';
import AudioChallenge from '../games/audiochallenge/audiochallenge';
import Store from '../store/store';
import MainPage from './mainPage';
import TextBook from './textBook';

const PAGES_TYPES = {
  Main: MainPage,
  AudioChallenge,
  TextBook,
};

type TPageClass = { [key:string]: AudioChallenge | MainPage | TextBook } | undefined;

export default class PageManager {
  store:Store;

  router:Router;

  pageClass: TPageClass;

  mainElement: HTMLElement;

  constructor(store:Store, router:Router) {
    this.store = store;
    this.router = router;
    this.pageClass = this.setPages();
    this.mainElement = document.getElementsByTagName('main')[0] as HTMLElement;
    this.mainElement.innerHTML = '';
    store.addWatcher('currentPage', () => { this.resetPage(); });
    this.resetPage();
  }

  resetPage() {
    const currentPage = this.store.getCurrentPageName();
    const currentClass = this.pageClass && this.pageClass[currentPage];
    if (currentClass) {
      this.mainElement.append(currentClass.create());
    } else {
      console.log('Wrong Page');
    }
  }

  setPages():TPageClass {
    const pageObj:TPageClass = {};
    Object.entries(PAGES_TYPES).forEach((entry) => {
      pageObj[entry[0] as string] = new entry[1]();
    });
    return pageObj;
  }
}

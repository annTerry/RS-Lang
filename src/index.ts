import './style.scss';

import Header from './components/header/header';
import Footer from './components/footer/footer';

import Store from './store/store';
import Router from './api/router';
import PageManager from './components/pageManager';

console.log('Works!');

const mainStore = new Store();
const mainRouter = new Router(mainStore);

console.log(mainStore.getCurrentPageName());

/* mainStore.setCurrentPage('AudioChallenge');
console.log(mainStore.getCurrentPageName());
 */
 
(() => new Header(mainStore))();
(() => new Footer())();
(() => new PageManager(mainStore, mainRouter))();


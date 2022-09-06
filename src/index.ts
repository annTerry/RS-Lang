import './style.scss';

import Header from './components/header/header';
import Footer from './components/footer/footer';

import Auth from './components/auth/auth';
import Store from './store/store';
import Router from './api/router';
import PageManager from './components/pageManager';

const mainStore = new Store();
const mainRouter = new Router(mainStore);

console.log('По возможности, отложите, пожалуйста, проверку на четверг');

/* mainStore.setCurrentPage('AudioChallenge');
console.log(mainStore.getCurrentPageName());
 */
(() => new Header(mainStore, mainRouter))();
(() => new Auth(mainStore))();
(() => new PageManager(mainStore, mainRouter))();
(() => new Footer())();

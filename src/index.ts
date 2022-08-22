import './style.scss';

import Header from './components/header/header';
import Footer from './components/footer/footer';

import AudioChallenge from './games/audiochallenge/audiochallenge';
import Store from './store/store';

console.log('Works!');

const mainStore = new Store();

console.log(mainStore.getCurrentPageName());
mainStore.setCurrentPage('AudioChallenge');
console.log(mainStore.getCurrentPageName());

(() => new Header())();
(() => new Footer())();

const audiolink = document.getElementById('audiochellenge-link');
audiolink?.addEventListener('click', () => { const gameAudio = new AudioChallenge(); gameAudio.creat(); });

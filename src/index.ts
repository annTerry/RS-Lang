import './style.scss';
import Audiochellenge from './games/audiochellenge/audiochellenge';
import Store from './store/store';

console.log('Works!');

const mainStore = new Store();

console.log(mainStore.getCurrentPageName());
mainStore.setCurrentPage('AudioChallenge');
console.log(mainStore.getCurrentPageName());

const audiolink = document.getElementById('audiochellenge-link');
audiolink?.addEventListener('click', () => { const gameAudio = new Audiochellenge(); gameAudio.creat(); });

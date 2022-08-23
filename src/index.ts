import './style.scss';
import AudioChallenge from './games/audiochallenge/audiochallenge';
import Store from './store/store';

console.log('Works!');

const mainStore = new Store();

console.log(mainStore.getCurrentPageName());
mainStore.setCurrentPage('AudioChallenge');
console.log(mainStore.getCurrentPageName());

const audiolink = document.getElementById('audiochellenge-link');
audiolink?.addEventListener('click', () => { const gameAudio = new AudioChallenge(); gameAudio.create(); });

import './style.scss';
import Audiochellenge from './games/audiochellenge/audiochellenge';

console.log('Works!');

const audiolink = document.getElementById('audiochellenge-link');
audiolink?.addEventListener('click', () => { const gameAudio = new Audiochellenge(); gameAudio.creat(); });

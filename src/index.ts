import './style.scss';
import audiochellenge from './games/audiochellenge/audiochellenge1';

console.log('Works!');
const audiolink = document.getElementById('audiochellenge-link');
audiolink?.addEventListener('click', audiochellenge);

import './style.scss';
import GetData from './api/getData';

const fetchData = new GetData();
fetchData.getData('words?group number=0&page=0', (data) => {
  data.forEach((el) => console.log(el));
});
console.log('Works!');

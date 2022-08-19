import { DATABASE_LINK } from '../common/constants';
import { TWordSimple, GetWordsFunction } from '../common/baseTypes';

export default class GetData {
  async getData(dataType:string, fn:GetWordsFunction) {
    await fetch(`${DATABASE_LINK}/${dataType}`).then((response) => response.json()).then((data:JSON) => {
      const returnData: Array<TWordSimple> = JSON.parse(JSON.stringify(data));
      fn(returnData);
    }).catch((err) => {
      console.log('Error: ', err);
    });
  }
}

/* Use

import GetData from './api/getData';

const fetchData = new GetData();
fetchData.getData('words?group number=0&page=0', (data) => {
  data.forEach((el) => console.log(el));
}); */

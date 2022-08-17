import { DATABASE_LINK } from '../common/constants';
import { WordSimple, GetWordsFunction } from '../common/baseTypes';

export default class GetData {
  async getData(dataType:string, fn:GetWordsFunction) {
    await fetch(`${DATABASE_LINK}/${dataType}`).then((response) => response.json()).then((data:JSON) => {
      const returnData: Array<WordSimple> = JSON.parse(JSON.stringify(data));
      fn(returnData);
    }).catch((err) => {
      console.log('Error: ', err);
    });
  }
}
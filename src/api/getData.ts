import { DATABASE_LINK } from '../common/constants';
import {
  TWordSimple, GetWordsFunction, TUserWord, GetUserWordsFunction,
} from '../common/baseTypes';

export default class GetData {
  static async getData(dataType:string, fn:GetWordsFunction) {
    await fetch(`${DATABASE_LINK}/${dataType}`).then((response) => response.json()).then((data:JSON) => {
      const returnData: Array<TWordSimple> = JSON.parse(JSON.stringify(data));
      fn(returnData);
    }).catch((err) => {
      console.log('Error: ', err);
    });
  }

  static async getDataHard(
    userId: string,
    userToken: string,
    fn:GetWordsFunction,
  ) {
    const filter = { $and: [{ 'userWord.difficulty': 'hard', 'userWord.optional.isStudy': false }] };
    await fetch(`${DATABASE_LINK}/users/${userId}/AggregatedWords?filter=${JSON.stringify(filter)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userToken}`,
        Accept: 'application/json',
      },
    }).then((response) => response.json()).then((resData:JSON) => {
      console.log(resData);
      const data = JSON.parse(JSON.stringify(resData));
      console.log(data);
      const returnData: Array<TWordSimple> = data[0].paginatedResults;
      fn(returnData);
    }).catch((err) => {
      console.log('Error: ', err);
    });
  }

  static async getUserWordsDataAggregated(
    userId: string,
    userToken: string,
    fn:GetUserWordsFunction,
  ) {
    await fetch(`${DATABASE_LINK}/users/${userId}/words`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userToken}`,
        Accept: 'application/json',
      },
    }).then((response) => response.json()).then((data:JSON) => {
      const returnData: Array<TUserWord> = JSON.parse(JSON.stringify(data));
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

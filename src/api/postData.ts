import { DATABASE_LINK } from '../common/constants';
import {
  TUser, PostUserFunction, TUserWord, StoreCallbackFunction,
} from '../common/baseTypes';

export default class PostData {
  options: RequestInit = {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    body: '',
  };

  async postData(dataType:string, userData: TUser, fn:PostUserFunction) {
    this.options.body = JSON.stringify(userData);
    await fetch(`${DATABASE_LINK}/${dataType}`, this.options).then((response) => response.json()).then((data:JSON) => {
      const returnData: TUser = JSON.parse(JSON.stringify(data));
      fn(returnData);
    }).catch((err) => {
      console.log('Error: ', err);
    });
  }

  static async setUserWordsData(
    userId: string,
    userToken: string,
    word: string,
    wordOptions: TUserWord,
    fn:StoreCallbackFunction,
    method = 'POST',
  ) {
    await fetch(`${DATABASE_LINK}/users/${userId}/words/${word}`, {
      method,
      headers: {
        Authorization: `Bearer ${userToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(wordOptions),
    }).then((response) => response.json()).then((data:JSON) => {
      console.log(data);
      fn();
    }).catch((err) => {
      console.log('Error: ', err);
    });
  }
}

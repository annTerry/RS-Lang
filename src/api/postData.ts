import { DATABASE_LINK } from '../common/constants';
import { TUser, PostUserFunction } from '../common/baseTypes';

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
}

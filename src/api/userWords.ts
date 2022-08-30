import { TUserWord } from '../common/baseTypes';
import { DATABASE_LINK } from '../common/constants';

async function createUserWord(
  userId:string,
  userToken: string,
  wordId:string,
  wordData: TUserWord,
) {
  const response = await fetch(
    `${DATABASE_LINK}/users/${userId}/words/${wordId}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${userToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(wordData),
    },
  );
  const content = await response.json();
  console.log('1', content);
}

async function getUserWord(userId: string, userToken: string, wordId:string) {
  const response = await fetch(`${DATABASE_LINK}/users/${userId}/aggregatedWords/${wordId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${userToken}`,
      Accept: 'application/json',
    },
  });
  const content = await response.json();
  return content[0].userWord;
}
export { getUserWord, createUserWord };

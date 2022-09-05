import { TUserWord, TWordSimple } from '../common/baseTypes';
import { DATABASE_LINK, ALL_PAGES } from '../common/constants';

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
  return content;
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
async function updateUserWord(
  userId: string,
  userToken: string,
  wordId:string,
  wordData: TUserWord,
) {
  const response = await fetch(`${DATABASE_LINK}/users/${userId}/words/${wordId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${userToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(wordData),
  });
  const content = await response.json();
  return content;
}
async function getWords(level:number, pageNumber?: number) {
  let page:number;
  if (!pageNumber) {
    page = Math.floor(Math.random() * ALL_PAGES);
  } else {
    page = pageNumber;
  }
  const res = await fetch(`${DATABASE_LINK}/words?group=${level}&page=${page}`);
  const wordsArray: Array<TWordSimple> = await res.json();
  return wordsArray;
}
async function getUserWordsPage(groupId: number, pageId: number, userId:string, userToken: string) {
  // const filter = { $and: [{ page: pageId }, { group: groupId }] };
  const filter = { $and: [{ $and: [{ page: pageId }, { group: groupId }] }, { $or: [{ userWord: null }, { 'userWord.optional.isStudy': false }] }] };
  const res = await fetch(`${DATABASE_LINK}/users/${userId}/aggregatedWords?&filter=${JSON.stringify(filter)}&wordsPerPage=20`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${userToken}`,
      Accept: 'application/json',
    },
  });
  const result = await res.json();
  const wordsArray: Array<TWordSimple> = result[0].paginatedResults;
  return wordsArray;
}
async function getUserWords(groupId: number, pageId: number, userId:string, userToken: string) {
  let wordsArray: Array<TWordSimple> = [];
  let page = pageId;
  do {
    /* eslint-disable no-await-in-loop */
    const bufer = await getUserWordsPage(groupId, page, userId, userToken);
    wordsArray = wordsArray.concat(bufer);
    page -= 1;
  } while (wordsArray.length < 20 && page >= 0);
  return wordsArray;
}
export {
  getUserWord, createUserWord, updateUserWord, getUserWords, getWords,
};

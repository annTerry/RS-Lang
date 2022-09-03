import { TUserStatistic } from '../common/baseTypes';
import { DATABASE_LINK } from '../common/constants';

async function getUserStatistic(userId: string, userToken: string) {
  const response = await fetch(`${DATABASE_LINK}/users/${userId}/statistics`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${userToken}`,
      Accept: 'application/json',
    },
  });
  /* eslint no-else-return: "off" */
  if (response.ok) {
    const content = await response.json();
    return (content);
  } else {
    console.log('Статистика отсутствует.Новая статисктика была создана.');
    return null;
  }
}

async function updateUserStatistic(
  userId: string,
  userToken: string,
  statisticObj: TUserStatistic,
) {
  const response = await fetch(`${DATABASE_LINK}/users/${userId}/statistics`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${userToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(statisticObj),
  });
  const content = await response.json();
  return content;
}

export { updateUserStatistic, getUserStatistic };

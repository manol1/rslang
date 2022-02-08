import { ELinks,
  TGetWords,
  IBodyCreateUser,
  IUser,
  TEmailPass,
  TSignIn,
  TToken,
  TBodyUserWorld,
  TUserWorld,
  TUserStatistic,
  TBodyUserStatistic,
  TUserSetting,
  TBodyUserSetting,
  TAggregatedWord,
 } from './type/types';

export async function getWords(group = '0', page = '0'): Promise<TGetWords[]> {
  const response = await fetch(`${ELinks.words}?group=${group}&page=${page}`, {
    headers: {
      'Accept': 'application/json',
    },
  });
  return response.json();
}

export async function getWordById(id: string): Promise<TGetWords> {
  const response = await fetch(`${ELinks.words}/${id}`);
  return response.json();
}

export async function createUser(body: IBodyCreateUser): Promise<IUser> {
  const response = await fetch(ELinks.users, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return response.json();
}

export async function signIn(body: TEmailPass): Promise<TSignIn> {
  const response = await fetch(ELinks.signIn, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return response.json();
}

export async function getUserById(id: string, token: string): Promise<IUser> {
  const response = await fetch(`${ELinks.users}/${id}`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
}

export async function updateUser(id: string, body: TEmailPass, token: string): Promise<IUser> {
  const response = await fetch(`${ELinks.users}/${id}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  return response.json();
}

export async function deleteUser(id: string, token: string): Promise<void> {
  const response = await fetch(`${ELinks.users}/${id}`, {
    method: 'DELETE',
    headers: {
      'Accept': '*/*',
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
}

export async function getTokens(id: string, refreshToken: string): Promise<TToken> {
  const response = await fetch(`${ELinks.users}/${id}/tokens`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${refreshToken}`,
    },
  });
  return response.json();
}

export async function createUserWord(id: string, wordId: string, body: TBodyUserWorld, token: string): Promise<TUserWorld> {
  const response = await fetch(`${ELinks.users}/${id}/words/${wordId}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  return response.json();
}

export async function getUserWords(id: string, token: string): Promise<TUserWorld[]> {
  const response = await fetch(`${ELinks.users}/${id}/words`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
}

export async function getUserWordById(id: string, wordId: string, token: string): Promise<TUserWorld>{
  const response = await fetch(`${ELinks.users}/${id}/words/${wordId}`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
}

export async function updateUserWord(id: string, wordId: string, body: TBodyUserWorld, token: string): Promise<TUserWorld> {
  const response = await fetch(`${ELinks.users}/${id}/words/${wordId}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  return response.json();
}

export async function deleteUserWord(id: string, wordId: string, token: string): Promise<void> {
  const response = await fetch(`${ELinks.users}/${id}/words/${wordId}`, {
    method: 'DELETE',
    headers: {
      'Accept': '*/*',
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
}

export async function putUserStatistics(id: string, body: TBodyUserStatistic, token: string): Promise<TUserStatistic> {
  const response = await fetch(`${ELinks.users}/${id}/statistics`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  return response.json();
}

export async function getUserStatistics(id: string, token: string): Promise<TUserStatistic> {
  const response = await fetch(`${ELinks.users}/${id}/statistics`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
}

export async function putUserSettings(id: string, body: TBodyUserSetting, token: string): Promise<TUserSetting> {
  const response = await fetch(`${ELinks.users}/${id}/settings`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  return response.json();
}

export async function getUserSettings(id: string, token: string): Promise<TUserSetting> {
  const response = await fetch(`${ELinks.users}/${id}/settings`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
}

export async function getAggregatedWordById(id: string, wordId: string, token: string): Promise<TAggregatedWord[]> {
  const response = await fetch(`${ELinks.users}/${id}/aggregatedWords/${wordId}`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
}

// function isEmptyFilter(obj: object) {
//   for (let key in obj) {
//     return false;
//   }
//   return true;
// }

// export async function getAggregatedWords(id: string, token: string, page = 0, wordsPerPage = 10, filter = {}, group?: number): Promise<TAggregatedWords[]> {
//   let link: string;
//   if (group && isEmptyFilter(filter) === true) {
//     link = `${ELinks.users}/${id}/aggregatedWords?page=${page}`
//   }
//   const response = await fetch(link, {
//     headers: {
//       'Accept': 'application/json',
//       'Authorization': `Bearer ${token}`,
//     },
//   });
//   return response.json();
// }

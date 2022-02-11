export enum ELinks {
  link = 'https://bukman-rs-lang.herokuapp.com',
  words = 'https://bukman-rs-lang.herokuapp.com/words',
  users = 'https://bukman-rs-lang.herokuapp.com/users',
  signIn = 'https://bukman-rs-lang.herokuapp.com/signin',
}

export type TGetWords = {
  id: string,
  group: number,
  page: number,
  word: string,
  image: string,
  audio: string,
  audioMeaning: string,
  audioExample: string,
  textMeaning: string,
  textExample: string,
  transcription: string,
  wordTranslate: string,
  textMeaningTranslate: string,
  textExampleTranslate: string,
};

export interface INameEmail {
  name: string,
  email: string,
}

export interface IBodyCreateUser extends INameEmail {
  password: string,
}

export interface IUser extends INameEmail {
  id: string,
}

export type TEmailPass = {
  email: string,
  password: string,
};

export type TSignIn = {
  message: string,
  token: string,
  refreshToken: string,
  userId: string,
  name: string,
};

export type TToken = {
  token: string,
  refreshToken: string,
};

export type TUserWorld = {
  id: string,
  difficulty: string,
  wordId: string,
};

export type TBodyUserWorld = {
  difficulty: string,
  optional: object,
};

export type TUserStatistic = {
  id: string,
  learnedWords: number,
};

export type TBodyUserStatistic = {
  learnedWords: number,
  optional: object,
};

export type TUserSetting = {
  id: string,
  wordsPerDay: number,
};

export type TBodyUserSetting = {
  wordsPerDay: number,
  optional: object,
};

export type TAggregatedWord = {
  _id: string,
  group: number,
  page: number,
  word: string,
  image: string,
  audio: string,
  audioMeaning: string,
  audioExample: string,
  textMeaning: string,
  textExample: string,
  transcription: string,
  wordTranslate: string,
  textMeaningTranslate: string,
  textExampleTranslate: string,
  userWord?: object,
};

type TCount = {
  count: number,
};

export type TAggregatedWords = {
  paginatedResults: TAggregatedWord[],
  totalCount: TCount[],
};

export enum WordDifficulty {
  hard = 'hard',
  easy = 'easy',
}

export enum GameNames {
  sprint = 'sprint',
  audiocall = 'audiocall',
}

export enum MenuLinks {
  dictionary = 'dictionary',
  sprint = 'sprint',
  audiocall = 'audiocall',
  statistics = 'statistics',
  developers = 'developers',
  games = 'games',
}

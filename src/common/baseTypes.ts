type TWordSimple = {
  'id': string,
  'group': number,
  'page': number,
  'word': string,
  'image': string,
  'audio': string,
  'audioMeaning': string,
  'audioExample': string,
  'textMeaning': string,
  'textExample': string,
  'transcription': string,
  'wordTranslate': string,
  'textMeaningTranslate': string,
  'textExampleTranslate': string,
};

type TUser = {
  'id'?: string,
  'name': string,
  'email': string,
  'password'?: string
};

enum PagesCategory {
  Main = 'Main',
  Textbook = 'Textbook',
  WordList = 'WordList',
  AudioChallenge = 'AudioChallenge',
  SprintChallenge = 'SprintChallenge',
  Statistics = 'Statistics',
}

type TPage = {
  page:PagesCategory,
  number?:number
};

type TWordStat = {
  'hard'?:boolean,
  'positive':number,
  'negative':number,
};

type TWordObject = {
  'id': string,
  'stat': TWordStat,
};

type TStoreBase = {
  authorization: boolean,
  token?: string,
  currentPage: TPage,
  words?: TWordObject
};

type GetWordsFunction = (data:Array<TWordSimple>) => void;
type PostUserFunction = (data:TUser) => boolean;

export {
  TWordSimple, TUser, GetWordsFunction, PostUserFunction,
  TStoreBase, TPage, PagesCategory, TWordStat, TWordObject,
};

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
  part?:number,
  number?:number
};

type TWordStat = {
  'hard'?:boolean,
  'positive':number,
  'negative':number,
};
type TPageAndPart = {
  part?:number,
  number?:number
};

type TWordObject = {
  'id': string,
  'stat': TWordStat,
};

type TStoreBase = {
  uid: string,
  username?: string,
  token?: string,
  currentPage: TPage,
  words?: { [id:string]: TWordStat },
  textBook?: TPageAndPart,
};

type GetWordsFunction = (data:Array<TWordSimple>) => void;
type PostUserFunction = (data:TUser) => boolean;
type StoreCallbackFunction = ()=>void;

type TErrorMessage = {
  path?: string,
  message?: string,
};

type TAlertType = 'success' | 'warning' | 'danger';

type TUserWord = {
  difficulty: string
  optional: {
    isStudy: boolean,
    correctCount: number;
    totalIncorrectCount: number;
    totalCorrectCount: number;
  },
};
type TUserStatistic = {
  learnedWords: number,
  optional: {
    date: string;
    audioChallenge: {
      correctAnswers: number;
      wrongAnswers: number;
      series: number;
      newWords: number;
    }
  }
};
type GetWordsStatFunction = (data:Array<TUserWord>) => void;
export {
  TWordSimple, TUser, GetWordsFunction, PostUserFunction,
  TStoreBase, TPage, PagesCategory, TWordStat, TWordObject,
  TAlertType, TErrorMessage, GetWordsStatFunction,
  StoreCallbackFunction, TPageAndPart, TUserWord, TUserStatistic,
};

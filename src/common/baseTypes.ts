type WordSimple = {
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

type User = {
  'id'?: string,
  'name': string,
  'email': string,
  'password'?: string
};

type GetWordsFunction = (data:Array<WordSimple>) => void;
type PostUserFunction = (data:User) => boolean;

export {
  WordSimple, User, GetWordsFunction, PostUserFunction,
};

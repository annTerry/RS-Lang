import { TWordObject } from '@common/baseTypes';
import './word.scss';

export default class Word {
  data:TWordObject;

  element: HTMLElement;

  constructor(word:TWordObject) {
    this.data = word;
    this.element = document.createElement('div');
    this.element.classList.add('one-word-container');
  }
}

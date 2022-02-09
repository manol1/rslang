import { TGetWords } from './type/types';
import { store } from './store/store';
import Word from './Word';
import { getWords } from './requests';

export default class Dictionary {
  words: TGetWords[];

  page: string;

  grade: string;

  container: HTMLDivElement;

  constructor(
    container: HTMLDivElement,
    grade = '0',
    page = '0' ) {
    this.page = page;
    this.grade = grade;
    this.words = [];
    this.container = document.querySelector('.dictionary__row') as HTMLDivElement;
  }

  async getData() {
    this.words = await getWords(this.grade, this.page);
  }

  render() {
    this.container.innerHTML = '';

    this.words.map(word => {
      const newWord = new Word(word, store.isAuthorized);
      newWord.render(this.container);
      newWord.bindListener();
    });
  }
}

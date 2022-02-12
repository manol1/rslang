import { TGetWords, TAggregatedWord, ELinks } from './type/types';
import { store } from './store/store';
import Word from './Word';
import { getWords, getAggregatedWords } from './requests';

export default class Dictionary {
  words: TGetWords[] | TAggregatedWord[];

  page: string;

  grade: string;

  container: HTMLDivElement;

  isComplicated: boolean;

  constructor(
    container: HTMLDivElement,
    isComplicated: boolean,
    grade = '0',
    page = '0',
  ) {
    this.page = page;
    this.grade = grade;
    this.words = [];
    this.container = document.querySelector('.dictionary__row') as HTMLDivElement;
    this.isComplicated = isComplicated;
  }

  async getData() {
    if (this.isComplicated === true) {
      const filterStr = 'aggregatedWords?wordsPerPage=3600&filter=%7B%22userWord.difficulty%22%3A%22hard%22%7D';
      this.words = (await getAggregatedWords(localStorage.getItem('userId') || '',
        localStorage.getItem('token') || '',
        `${ELinks.users}/${localStorage.getItem('userId')}/${filterStr}`))[0].paginatedResults;
    } else {
      this.words = await getWords(this.grade, this.page);
    }
  }

  render() {
    this.container.innerHTML = '';

    this.words.map(word => {
      const newWord = new Word(word, store.isAuthorized, this.isComplicated);
      newWord.render(this.container);
      newWord.bindListener();
    });
  }
}

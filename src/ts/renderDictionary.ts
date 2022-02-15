import { store } from './store/store';
import Dictionary from './Dictionary';
import isExploredPage from './exploredPage';

export const renderDictionary = async (isComplicated = false) => {
  const dictEl = document.querySelector('.dictionary__row') as HTMLDivElement;
  const dict =  new Dictionary(dictEl, isComplicated, store.currentLevel, store.currentPage);
  await dict.getData();
  dict.render();
  dict.checkoAudio();

  const dictionaryFooter = <HTMLDivElement>document.querySelector('.dictionary-footer');
  const hardWordsBtn = <HTMLButtonElement>document.querySelector('.dictionary-lavels button:last-child');
  const promo = <HTMLButtonElement>document.querySelector('.promo');

  // const wordCards = document.querySelectorAll('.dictionary-card');
  // console.log(wordCards);


  if (promo.classList.contains('hidden') && !hardWordsBtn.classList.contains('hidden')) {
    dictionaryFooter.classList.remove('hidden');
  }
  if (isComplicated) {
    dictionaryFooter.classList.add('hidden');
  }
  if (!isComplicated && !hardWordsBtn.classList.contains('hidden')) {
    await isExploredPage();
  }
};

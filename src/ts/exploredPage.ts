import { store } from './store/store';
import { getAggregatedWords } from './requests';
import { ELinks } from './type/types';

async function isExploredPage() {
  const dictionaryRow = <HTMLDivElement>document.querySelector('.dictionary__row');
  const hardWordsBtn = <HTMLButtonElement>document.querySelector('.dictionary-levels button:last-child');
  const currentPage = <HTMLSpanElement>document.getElementById('current-page');
  const dictionaryGameBtns = document.querySelectorAll('.game');

  const linkStr = `wordsPerPage=20&filter=%7B%22%24and%22%3A%5B%7B%22%24or%22%3A%5B%7B%22userWord.difficulty%22%3A%22hard%22%7D%2C%7B%22userWord.difficulty%22%3A%22easy%22%7D%5D%7D%2C%20%7B%22page%22%3A${store.currentPage}%7D%5D%7D`;
  const link = `${ELinks.users}/${localStorage.getItem('userId')}/aggregatedWords?group=${store.currentLevel}&${linkStr}`;
  const words = (await getAggregatedWords(localStorage.getItem('token') || '', link))[0].paginatedResults;

  if (words.length > 19 && !hardWordsBtn.classList.contains('hidden')) {
    dictionaryRow.style.backgroundColor = 'rgba(0, 255, 0, .4)';
    currentPage.style.color = 'darkgreen';
    dictionaryGameBtns.forEach(btn => btn.classList.add('hidden'));

  } else {
    dictionaryRow.style.backgroundColor = 'transparent';
    currentPage.style.color = '#ffffff';
    dictionaryGameBtns.forEach(btn => btn.classList.remove('hidden'));
  }
}


export default isExploredPage;

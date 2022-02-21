import { renderDictionary } from './renderDictionary';
import { store } from './store/store';

function getComplicatedWords() {
  const hardWordsBtn = <HTMLButtonElement>document.querySelector('.dictionary-levels button:last-child');
  const dictionaryRow = <HTMLDivElement>document.querySelector('.dictionary__row');
  const dictionaryControl = <HTMLDivElement>document.querySelector('.dictionary-controls');
  const currentPage = <HTMLSpanElement>document.getElementById('current-page');
  const dictionaryGameBtns = document.querySelectorAll('.game');

  hardWordsBtn.addEventListener('click', async () => {
    store.isComplicatedWordPage = true;
    dictionaryRow.style.backgroundColor = 'transparent';
    dictionaryControl.classList.add('hidden');
    currentPage.style.color = '#ffffff';
    dictionaryGameBtns.forEach(btn => btn.classList.remove('hidden'));
    await renderDictionary(true);
  });
}

export default getComplicatedWords;

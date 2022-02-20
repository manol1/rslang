import { renderDictionary } from './renderDictionary';
import { store } from './store/store';

function getComplicatedWords() {
  const hardWordsBtn = <HTMLButtonElement>document.querySelector('.dictionary-levels button:last-child');
  // const dictionaryFooter = <HTMLDivElement>document.querySelector('.dictionary-footer');
  const dictionaryRow = <HTMLDivElement>document.querySelector('.dictionary__row');
  const currentPage = <HTMLSpanElement>document.getElementById('current-page');

  hardWordsBtn.addEventListener('click', async () => {
    store.isComplicatedWordPage = true;
    dictionaryRow.style.backgroundColor = 'transparent';
    currentPage.style.color = '#ffffff';
    await renderDictionary(true);
    // dictionaryFooter.classList.add('footer-hidden');
  });
}

export default getComplicatedWords;

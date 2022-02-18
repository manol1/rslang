import { renderDictionary } from './renderDictionary';
import { store } from './store/store';

function getComplicatedWords() {
  const hardWordsBtn = <HTMLButtonElement>document.querySelector('.dictionary-lavels button:last-child');
  const dictionaryFooter = <HTMLDivElement>document.querySelector('.dictionary-footer');
  const dictionaryRow = <HTMLDivElement>document.querySelector('.dictionary__row');

  hardWordsBtn.addEventListener('click', async () => {
    store.isComplicatedWordPage = true;
    dictionaryRow.style.backgroundColor = 'transparent';
    await renderDictionary(true);
    // dictionaryFooter.classList.add('footer-hidden');
  });
}

export default getComplicatedWords;

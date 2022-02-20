import { renderDictionary } from './renderDictionary';
import { store } from './store/store';

function getComplicatedWords() {
  const hardWordsBtn = <HTMLButtonElement>document.querySelector('.dictionary-levels button:last-child');
  const dictionaryFooter = <HTMLDivElement>document.querySelector('.dictionary-footer');
  const dictionaryRow = <HTMLDivElement>document.querySelector('.dictionary__row');
  const dictionaryControl = <HTMLDivElement>document.querySelector('.dictionary-controls');

  hardWordsBtn.addEventListener('click', async () => {
    store.isComplicatedWordPage = true;
    dictionaryRow.style.backgroundColor = 'transparent';
    dictionaryControl.classList.add('hidden');
    await renderDictionary(true);
    // dictionaryFooter.classList.add('footer-hidden');
  });
}

export default getComplicatedWords;

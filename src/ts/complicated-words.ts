import { renderDictionary } from './renderDictionary';

function getComplicatedWords() {
  const hardWordsBtn = <HTMLButtonElement>document.querySelector('.dictionary-lavels button:last-child');
  const dictionaryFooter = <HTMLDivElement>document.querySelector('.dictionary-footer');
  const dictionaryRow = <HTMLDivElement>document.querySelector('.dictionary__row');

  hardWordsBtn.addEventListener('click', async () => {
    dictionaryRow.style.backgroundColor = 'transparent';
    await renderDictionary(true);
    dictionaryFooter.classList.add('hidden');
  });
}

export default getComplicatedWords;

import navigation from './navigation';
import authentification from './authentification';
import getComplicatedWords from './complicated-words';
import { store } from './store/store';
import { renderDictionary } from './renderDictionary';
import sprint from './sprint/sprint';
import { setCurrentLevel,
  startAudioCallGame } from '../ts/audiocall/startAudioCallGame';
import { navigateWordStatistics } from './statistics/word-statistics';
import { CallAudiogameFrom } from './type/types';
import { navigateStatistics } from './statistics/statistics';
import { getUserById } from './requests';

export default async function App() {
  const levelBtns = document.querySelectorAll('.words-level');
  const nextPageBtn = document.querySelector('#next-page') as HTMLButtonElement;
  const prevPageBtn = document.querySelector('#prev-page') as HTMLButtonElement;
  const currentPageInfo = document.querySelector('#current-page') as HTMLElement;
  const dictionaryControl = <HTMLDivElement>document.querySelector('.dictionary-controls');

  window.addEventListener('load', () => {
    if (localStorage.getItem('token')) {
      getUserById(localStorage.getItem('userId') || '', localStorage.getItem('token') || '');
      console.log('автовход')
      // renderDictionary();
    }
  });

  navigation();

  authentification();

  //render dictionary
  // renderDictionary();
  console.log('renderDictionary из app')

  levelBtns.forEach(level => level.addEventListener('click', (event: Event) => {
    store.isComplicatedWordPage = false;
    store.currentLevel = (event.target as HTMLButtonElement).dataset.level || '0';
    console.log('current btn level', (event.target as HTMLButtonElement).dataset.level);
    store.currentPage =  '0';
    currentPageInfo.textContent = String(+store.currentPage + 1);

    levelBtns.forEach(el => el.classList.remove('active'));
    (event.target as HTMLButtonElement).classList.add('active');

    renderDictionary();
    dictionaryControl.classList.remove('hidden');
  }));

  nextPageBtn.addEventListener('click', ()=> {

    if (+store.currentPage < 29) {
      store.currentPage = String(+store.currentPage + 1);
    } else {
      store.currentPage = '29';
    }
    currentPageInfo.textContent = String(+store.currentPage + 1);
    renderDictionary();
  });

  prevPageBtn.addEventListener('click', ()=> {

    if (+store.currentPage > 0) {
      store.currentPage = String(+store.currentPage - 1);
    } else {
      store.currentPage = '0';
    }

    currentPageInfo.innerHTML = String(+store.currentPage + 1);
    renderDictionary();
  });

  getComplicatedWords();
  sprint();

  //audiocall
  const audiocallLevelBtns = document.querySelectorAll('.audiocall-level');
  const startAudiocallBtn = document.querySelector('.audiocall-btn');
  const startAudiocallFromDictionary = document.querySelector('.game-audio');

  audiocallLevelBtns.forEach(level => level.addEventListener('click', setCurrentLevel));

  startAudiocallBtn?.addEventListener('click', () => {startAudioCallGame(CallAudiogameFrom.menu);});
  startAudiocallFromDictionary?.addEventListener('click', () => {startAudioCallGame(CallAudiogameFrom.dictionary);});

  navigateWordStatistics();
  navigateStatistics();
}

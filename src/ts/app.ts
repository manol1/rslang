import navigation from './navigation';
import authentification from './authentification';
import getComplicatedWords from './complicated-words';
import { store } from './store/store';
import { renderDictionary } from './renderDictionary';
import sprint from './sprint/sprint';
import { setCurrentLevel,
  startAudioCallGameFromDictionary,
  startAudioCallGame } from '../ts/audiocall/startAudioCallGame';
import { navigateWordStatistics } from './statistics/word-statistics';
import { navigateStatistics } from './statistics/statistics';


export default async function App() {
  const levelBtns = document.querySelectorAll('.words-level');
  const nextPageBtn = document.querySelector('#next-page') as HTMLButtonElement;
  const prevPageBtn = document.querySelector('#prev-page') as HTMLButtonElement;
  const currentPageInfo = document.querySelector('#current-page') as HTMLElement;

  navigation();

  authentification();

  //render dictionary
  renderDictionary();

  levelBtns.forEach(level => level.addEventListener('click', (event: Event) => {
    store.currentLevel = (event.target as HTMLButtonElement).dataset.level || '0';
    store.currentPage =  '0';
    currentPageInfo.textContent = String(+store.currentPage + 1);

    levelBtns.forEach(el => el.classList.remove('active'));
    (event.target as HTMLButtonElement).classList.add('active');

    renderDictionary();
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
  startAudiocallBtn?.addEventListener('click', startAudioCallGame);
  startAudiocallFromDictionary?.addEventListener('click', startAudioCallGameFromDictionary);

  navigateWordStatistics();
  navigateStatistics();
}

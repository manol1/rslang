import { store } from '../store/store';
import { getWords, getAggregatedWords } from '../requests';
import { TGetWords, TAggregatedWord, ELinks } from '../type/types';
import Quiz from '../audiocall/Quiz';

export default function startAudioCallGame() {

  const audiocallLevelBtns = document.querySelectorAll('.audiocall-level');
  const startAudiocallBtn = document.querySelector('.audiocall-btn');
  const audiocallWelcome = document.querySelector('.audiocall-welcome');
  const audiocallQuestion = document.querySelector('.audiocall-question');
  const startAudiocallFromNav = document.querySelector('.game-menu_audiocall');
  const startAudiocallFromDictionary = document.querySelector('.game-audio');
  const closeResult = document.querySelector('.close-result');
  const audiocallResult = document.querySelector('.audiocall-result');

  const setCurrentLevel = (event: Event) => {
    store.audiocallCurrentLevel = (event.target as HTMLButtonElement).dataset.level || '0';
    audiocallLevelBtns.forEach(el => el.classList.remove('active'));
    (event.target as HTMLButtonElement).classList.add('active');
  };

  const openAudioCallGame = () => {
    audiocallWelcome?.classList.add('hidden');
    audiocallQuestion?.classList.remove('hidden');
  };

  const startQuiz = async () => {
    let words: TGetWords[];
    if (!store.isAuthorized) {
      words = await getWords(store.audiocallCurrentLevel, String(Math.floor(Math.random() * 30)));
    } else {
      words = await getWords(store.currentLevel, store.currentPage);
    }
    const quiz = new Quiz(words);
    quiz.bindListener();
    console.log('start with level: ', store.audiocallCurrentLevel);
  };


  const startQuizfromDictionary = async () => {
    let words: TGetWords[] | TAggregatedWord[];
    if (!store.isAuthorized) {
      words = await getWords(store.currentLevel, store.currentPage);
    } else {
      if (store.isComplicatedWordPage) {
        const filterStr = 'aggregatedWords?filter=%7B%22userWord.difficulty%22%3A%22hard%22%7D';
        words = (await getAggregatedWords(localStorage.getItem('userId') || '',
          localStorage.getItem('token') || '',
          `${ELinks.users}/${localStorage.getItem('userId')}/${filterStr}`))[0].paginatedResults;
        console.log('hard words', words);
      } else {
        const filterStr = `aggregatedWords?group=${store.currentLevel}
        &filter=%7B%22%24and%22%3A%5B%7B%22%24or%22%3A%5B%7B%22userWord.
        difficulty%22%3A%22hard%22%7D%2C%7B%22userWord
        %22%3Anull%7D%5D%7D%2C%20%20%7B%22page%22%3A
        ${store.currentPage}%7D%20%5D%7D`;
        words = (await getAggregatedWords(localStorage.getItem('userId') || '',
          localStorage.getItem('token') || '',
          `${ELinks.users}/${localStorage.getItem('userId')}/${filterStr}`))[0].paginatedResults;
      }
    }
    const quiz = new Quiz(words);
    quiz.bindListener();
  };

  audiocallLevelBtns.forEach(level => level.addEventListener('click', setCurrentLevel));
  startAudiocallBtn?.addEventListener('click', openAudioCallGame);
  startAudiocallBtn?.addEventListener('click', startQuiz);
  startAudiocallFromNav?.addEventListener('click', openAudioCallGame);
  startAudiocallFromDictionary?.addEventListener('click', openAudioCallGame);
  startAudiocallFromDictionary?.addEventListener('click', startQuizfromDictionary);

  closeResult?.addEventListener('click', () => {
    audiocallResult?.classList.add('hidden');
  });

}


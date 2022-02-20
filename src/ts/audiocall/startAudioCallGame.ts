import { store } from '../store/store';
import { getWords, getAggregatedWords } from '../requests';
import { TGetWords, TAggregatedWord, ELinks, CallAudiogameFrom } from '../type/types';
import Quiz from '../audiocall/Quiz';
import { navigateToAudiocallStart, navigateBackToDictionary } from './utils';
import { renderDictionary } from '../renderDictionary';


const audiocallLevelBtns = document.querySelectorAll('.audiocall-level');
const audiocallWelcome = document.querySelector('.audiocall-welcome');
const audiocallQuestion = document.querySelector('.audiocall-question');
const closeResult = document.querySelector('.close-result');
const audiocallResult = document.querySelector('.audiocall-result') as HTMLElement;
const exitGame = document.querySelector('.audiocall-question__settings_exit') as HTMLElement;

const logoName = <HTMLDivElement>document.querySelector('.header__logo_link');
const menuNavLinks = document.querySelectorAll('.header__nav_list-item');

export function setCurrentLevel(event: Event){
  store.audiocallCurrentLevel = (event.target as HTMLButtonElement).dataset.level || '0';
  audiocallLevelBtns.forEach(el => el.classList.remove('active'));
  (event.target as HTMLButtonElement).classList.add('active');
}

function moveToQuastions(){
  audiocallWelcome?.classList.add('hidden');
  audiocallQuestion?.classList.remove('hidden');
}

export function startAudioCallGame(gameLink: string) {

  let quiz: Quiz | null = null;

  async function startQuiz(){
    const words = await getWords(store.audiocallCurrentLevel, String(Math.floor(Math.random() * 30)));
    quiz = new Quiz(words);
    quiz.bindListener();
  }

  async function startQuizfromDictionary(){
    let words: TGetWords[] | TAggregatedWord[];
    if (!store.isAuthorized) {
      words = await getWords(store.currentLevel, store.currentPage);
    } else {
      if (store.isComplicatedWordPage) {
        const filterStr = 'aggregatedWords?filter=%7B%22userWord.difficulty%22%3A%22hard%22%7D';
        words = (await getAggregatedWords(localStorage.getItem('token') || '',
          `${ELinks.users}/${localStorage.getItem('userId')}/${filterStr}`))[0].paginatedResults;
      } else {
        const filterStr = `aggregatedWords?group=${store.currentLevel}
            &filter=%7B%22%24and%22%3A%5B%7B%22%24or%22%3A%5B%7B%22userWord.
            difficulty%22%3A%22hard%22%7D%2C%7B%22userWord
            %22%3Anull%7D%5D%7D%2C%20%20%7B%22page%22%3A
            ${store.currentPage}%7D%20%5D%7D`;
        words = (await getAggregatedWords(localStorage.getItem('token') || '',
          `${ELinks.users}/${localStorage.getItem('userId')}/${filterStr}`))[0].paginatedResults;
      }
    }
    quiz = new Quiz(words);
    quiz.bindListener();
  }

  moveToQuastions();

  if (gameLink === CallAudiogameFrom.menu) {
    startQuiz();
  } else if (CallAudiogameFrom.dictionary) {
    startQuizfromDictionary();
  }


  closeResult?.addEventListener('click', () => {
    audiocallResult?.classList.add('hidden');
    quiz = null;
  });


  function closeQuiz() {
    quiz?.removeListener();
    quiz?.closeQuiz();
    quiz = null;
  }

  exitGame.addEventListener('click', () => {
    closeQuiz();
    if (CallAudiogameFrom.menu) {
      navigateToAudiocallStart();
    } else if (CallAudiogameFrom.dictionary) {
      navigateBackToDictionary();
      renderDictionary();
    }
  });

  //exit game from any link
  logoName.addEventListener('click', closeQuiz);
  menuNavLinks.forEach(link => link.addEventListener('click', closeQuiz));
}




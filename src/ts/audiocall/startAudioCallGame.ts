import { store } from '../store/store';
import { getWords, getAggregatedWords } from '../requests';
import { TGetWords, TAggregatedWord, ELinks, CallAudiogameFrom } from '../type/types';
import Quiz from '../audiocall/Quiz';
import { navigateToAudiocallStart, navigateBackToDictionary } from './utils';

const audiocallLevelBtns = document.querySelectorAll('.audiocall-level');
const audiocallWelcome = document.querySelector('.audiocall-welcome');
const audiocallQuestion = document.querySelector('.audiocall-question');
const closeResult = document.querySelector('.close-result');
const audiocallResult = document.querySelector('.audiocall-result') as HTMLElement;
const exitGame = document.querySelector('.audiocall-question__settings_exit') as HTMLElement;
const audiocallChangable = document.querySelector('.audiocall-question__changable') as HTMLElement;

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

        const linkStr = 'aggregatedWords?wordsPerPage=3600&filter=%7B%22userWord.difficulty%22%3A%22hard%22%7D';
        const link = `${ELinks.users}/${localStorage.getItem('userId')}/${linkStr}`;

        words = (await getAggregatedWords(localStorage.getItem('token') || '', link))[0].paginatedResults;
      } else {
        const linkStr = `wordsPerPage=20&filter=%7B%22%24and%22%3A%5B%7B%22%24or%22%3A%5B%7B%22userWord.difficulty%22%3A%22empty%22%7D%2C%20%7B%22userWord.difficulty%22%3A%22hard%22%7D%2C%20%7B%22userWord%22%3Anull
        %7D%5D%7D%2C%20%7B%22page%22%3A${store.currentPage}%7D%5D%7D`;

        const link = `${ELinks.users}/${localStorage.getItem('userId')}/aggregatedWords?group=${store.currentLevel}&${linkStr}`;
        words = (await getAggregatedWords(localStorage.getItem('token') || '', link))[0].paginatedResults;
      }
    }
    if (words.length >= 5) {
      quiz = new Quiz(words);
      quiz.bindListener();
    } else {
      navigateBackToDictionary();
      alert('Недостаточно слов для игры');
    }
  }

  moveToQuastions();

  if (gameLink === CallAudiogameFrom.menu) {
    startQuiz();
  } else if (gameLink === CallAudiogameFrom.dictionary) {
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
    if (gameLink === CallAudiogameFrom.menu) {
      // console.log('it is exiting from simple page', gameLink);
      navigateToAudiocallStart();
    } else if (gameLink === CallAudiogameFrom.dictionary) {
      // console.log('it is exiting from dictionary words', gameLink);
      navigateBackToDictionary();
    }
    audiocallChangable.innerHTML = '';
  });

  //exit game from any link
  logoName.addEventListener('click', closeQuiz);
  menuNavLinks.forEach(link => link.addEventListener('click', closeQuiz));
}




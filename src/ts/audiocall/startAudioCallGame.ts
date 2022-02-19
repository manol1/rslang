import { store } from '../store/store';
import { getWords, getAggregatedWords } from '../requests';
import { TGetWords, TAggregatedWord, ELinks } from '../type/types';
import Quiz from '../audiocall/Quiz';

const audiocallLevelBtns = document.querySelectorAll('.audiocall-level');
const startAudiocallBtn = document.querySelector('.audiocall-btn');
const audiocallWelcome = document.querySelector('.audiocall-welcome');
const audiocallQuestion = document.querySelector('.audiocall-question');
const startAudiocallFromDictionary = document.querySelector('.game-audio');
const closeResult = document.querySelector('.close-result');
const audiocallResult = document.querySelector('.audiocall-result');

export function setCurrentLevel(event: Event){
  store.audiocallCurrentLevel = (event.target as HTMLButtonElement).dataset.level || '0';
  audiocallLevelBtns.forEach(el => el.classList.remove('active'));
  (event.target as HTMLButtonElement).classList.add('active');
}

function moveToQuastions(){
  audiocallWelcome?.classList.add('hidden');
  audiocallQuestion?.classList.remove('hidden');
}

async function startQuiz(){
  const words = await getWords(store.audiocallCurrentLevel, String(Math.floor(Math.random() * 30)));
  const quiz = new Quiz(words);
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
  const quiz = new Quiz(words);
  quiz.bindListener();
}

export function startAudioCallGame() {
  moveToQuastions();
  startQuiz();

  closeResult?.addEventListener('click', () => {
    audiocallResult?.classList.add('hidden');
  });
}

export async function startAudioCallGameFromDictionary() {
  moveToQuastions();
  startQuizfromDictionary();
  closeResult?.addEventListener('click', () => {
    audiocallResult?.classList.add('hidden');
  });
}



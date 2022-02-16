import { store } from '../store/store';
import { getWords } from '../requests';
import { TGetWords } from '../type/types';
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
      words = await getWords(store.audiocallCurrentLevel, store.currentPage);
    } else {
      console.log(store.currentLevel, store.currentPage);
      words = await getWords(store.currentLevel, store.currentPage);
    }
    const quiz = new Quiz(words);
    quiz.bindListener();

    console.log('start with level: ', store.audiocallCurrentLevel);
  };

  audiocallLevelBtns.forEach(level => level.addEventListener('click', setCurrentLevel));
  startAudiocallBtn?.addEventListener('click', openAudioCallGame);
  startAudiocallBtn?.addEventListener('click', startQuiz);
  startAudiocallFromNav?.addEventListener('click', startQuiz);
  startAudiocallFromDictionary?.addEventListener('click', openAudioCallGame);
  startAudiocallFromDictionary?.addEventListener('click', startQuiz);

  closeResult?.addEventListener('click', () => {
    audiocallResult?.classList.add('hidden');
  });


}


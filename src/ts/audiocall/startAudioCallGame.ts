import { store } from '../store/store';

export default function startAudioCallGame() {

  const  audiocallLevelBtns = document.querySelectorAll('.audiocall-level');
  const startAudiocallBtn = document.querySelector('.audiocall-btn');
  const audiocallWelcome = document.querySelector('.audiocall-welcome');
  const audiocallQuestion = document.querySelector('.audiocall-question');


  // const renderWelcomeAudioCall = ( isAuthorized: boolean) => {

  // }


  audiocallLevelBtns.forEach(level => level.addEventListener('click', (event: Event) => {
    store.audiocallCurrentLevel = (event.target as HTMLButtonElement).dataset.level || '0';

    audiocallLevelBtns.forEach(el => el.classList.remove('active'));
    (event.target as HTMLButtonElement).classList.add('active');
  }));

  const openAudioCallGame = () => {
    audiocallWelcome?.classList.add('hidden');
    audiocallQuestion?.classList.remove('hidden');
  };

  startAudiocallBtn?.addEventListener('click', openAudioCallGame);

}


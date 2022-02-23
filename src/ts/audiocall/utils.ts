import { renderDictionary } from '../renderDictionary';
import { store } from '../store/store';

export function shuffle(array: string[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


export function playSound(isCorrect: boolean) {
  const audio = new Audio;
  if (isCorrect) {
    audio.src = './assets/sounds/correct.mp3';
  } else {
    audio.src = './assets/sounds/wrong1.wav';
  }
  audio.play();
}

export function pagination(questionArrlength: number) {

  const container = document.querySelector('.audiocall-question__pagination') as HTMLElement;
  const containerWidth = container?.getBoundingClientRect().width;

  container.innerHTML = '';

  for ( let i = 0; i < questionArrlength; i += 1) {
    const div = document.createElement('div');
    div.classList.add('dot');
    if (containerWidth) {
      const dotWidth = Math.round(containerWidth / questionArrlength);
      div.style.width = `${dotWidth}px`;
    }
    container?.appendChild(div);
  }
}

export function playAudio(el: HTMLAudioElement) {
  const playPromise = el?.play();
  if (playPromise !== null){
    playPromise?.catch(() => { el?.play(); });
  }
}

export function navigateToAudiocallStart() {
  const audiocallResult = document.querySelector('.audiocall-result') as HTMLElement;
  const audiocallWelcome = document.querySelector('.audiocall-welcome');
  audiocallResult.classList.add('hidden');
  audiocallWelcome?.classList.remove('hidden');
}

export function navigateBackToDictionary() {
  const dictionarySection = document.querySelector('.dictionary');
  const footerSection = document.querySelector('.footer');
  const dictionaryGameFooter = document.querySelector('.dictionary-footer');
  const audiocallSection = document.querySelector('.audiocall');
  const audiocallResult = document.querySelector('.audiocall-result') as HTMLElement;

  dictionarySection?.classList.remove('hidden');
  footerSection?.classList.remove('hidden');
  dictionaryGameFooter?.classList.remove('footer-hidden');
  audiocallSection?.classList.add('hidden');
  audiocallResult.classList.add('hidden');
  if (store.isComplicatedWordPage) {
    renderDictionary(true);
  } else {
    renderDictionary();
  }
}

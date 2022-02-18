import { TGetWords } from '../type/types';

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

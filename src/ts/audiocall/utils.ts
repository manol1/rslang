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


  // if (isFinished) {
  //   audio.src = './assets/sounds/roundEnd.mp3';
  // }
}


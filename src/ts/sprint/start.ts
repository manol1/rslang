import { getWordsForGame, closeResults } from './game';
import { store } from '../store/store';

export function sprintStart() {
  const sprintLevel: NodeListOf<HTMLDivElement> = document.querySelectorAll('.sprint-level');
  const sprintStart2 = <HTMLDivElement>document.querySelector('.sprint-start');
  const sprintGame = <HTMLDivElement>document.querySelector('.sprint-game');
  const sprintResult = <HTMLDivElement>document.querySelector('.sprint-result');
  const sprintStartBtn = <HTMLButtonElement>document.querySelector('.sprint-start-btn');
  const gameMenuSprint = <HTMLLIElement>document.querySelector('.game-menu_sprint');
  const gameSprint = <HTMLDivElement>document.querySelector('.game-sprint');

  gameMenuSprint.addEventListener('click', () => {
    closeResults();
  });

  gameSprint.addEventListener('click', () => {
    sprintGame.classList.remove('hidden');
    sprintStart2.classList.add('hidden');
    sprintResult.classList.add('hidden');
    getWordsForGame(store.currentLevel, true);
  });

  let currentSprintLevel = String(Array.from(sprintLevel).findIndex(el => el.classList.contains('active')));

  sprintLevel.forEach(el => {
    el.addEventListener('click', () => {
      sprintLevel.forEach(elem => elem.classList.remove('active'));
      el.classList.add('active');
      currentSprintLevel = String(Array.from(sprintLevel).findIndex(item => item.classList.contains('active')));
    });
  });

  sprintStartBtn.addEventListener('click', () => {
    sprintStart2.classList.add('hidden');
    sprintGame.classList.remove('hidden');
    getWordsForGame(currentSprintLevel, false);
  });
}

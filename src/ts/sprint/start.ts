import { getWordsForGame } from './game';

export function sprintStart() {
  const sprintLevel: NodeListOf<HTMLDivElement> = document.querySelectorAll('.sprint-level');
  const sprintStart = <HTMLDivElement>document.querySelector('.sprint-start');
  const sprintGame = <HTMLDivElement>document.querySelector('.sprint-game');
  const sprintStartBtn = <HTMLButtonElement>document.querySelector('.sprint-start-btn');
  const gameMenuSprint = <HTMLButtonElement>document.querySelector('.game-menu_sprint');







  let currentSprintLevel = String(Array.from(sprintLevel).findIndex(el => el.classList.contains('active')));
  console.log(currentSprintLevel);

  sprintLevel.forEach(el => {
    el.addEventListener('click', () => {
      sprintLevel.forEach(el => el.classList.remove('active'));
      el.classList.add('active');
      currentSprintLevel = String(Array.from(sprintLevel).findIndex(el => el.classList.contains('active')));
      console.log(currentSprintLevel);
    })
  });

  sprintStartBtn.addEventListener('click', async () => {
    sprintStart.classList.add('hidden');
    sprintGame.classList.remove('hidden');
    await getWordsForGame(currentSprintLevel);
  });




};

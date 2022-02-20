import {
  getAggregatedWordById,
  updateUserWord,
  createUserWord } from '../requests';
import { store } from '../store/store';
import { TOptionalWorld }  from '../type/types';
// import { updateGameStats } from '../';

const audioCallRight = <HTMLElement>document.getElementById('audiocall-right');
const audioCallWrong = <HTMLElement>document.getElementById('audiocall-wrong');
const sprintRight = <HTMLElement>document.getElementById('sprint-right');
const sprintWrong = <HTMLElement>document.getElementById('sprint-wrong');

export function navigateWordStatistics() {
  const wordStatisticsInGames = <HTMLDivElement>document.querySelector('.word-statistics-in-games');
  const closeWordStatisticsBtn = <HTMLSpanElement>document.querySelector('.word-statistics-container span');

  closeWordStatisticsBtn.addEventListener('click', () => {
    wordStatisticsInGames.classList.add('hidden');
    audioCallRight.innerHTML = '0';
    audioCallWrong.innerHTML = '0';
    sprintRight.innerHTML = '0';
    sprintWrong.innerHTML = '0';
  });
}

export async function getWordStatisticsInGame(wordId: string) {
  const hasUserWord = (await getAggregatedWordById(localStorage.getItem('userId') || '', wordId, localStorage.getItem('token') || ''))[0].userWord;
  if (hasUserWord) {
    return hasUserWord;
  }
}

export async function updateGameStats(game: string, answer: boolean, wordId: string) {
  const wordStatisticsInGame = await getWordStatisticsInGame(wordId);

  if (wordStatisticsInGame) {
    const difficalty = wordStatisticsInGame.difficulty;
    if (game === 'sprint' && answer === true) {
      wordStatisticsInGame.optional.games.sprint.right++;
    } else if (game === 'sprint' && answer === false) {
      wordStatisticsInGame.optional.games.sprint.wrong++;
    } else if (game === 'audiocall' && answer === true) {
      wordStatisticsInGame.optional.games.audiocall.right++;
    } else if (game === 'audiocall' && answer === false) {
      wordStatisticsInGame.optional.games.audiocall.wrong++;
    }
    await updateUserWord(localStorage.getItem('userId') || '', wordId, { difficulty: difficalty, optional: wordStatisticsInGame.optional }, localStorage.getItem('token') || '');
  } else {
    const userOptional: TOptionalWorld = JSON.parse(JSON.stringify(store.optional));
    if (game === 'sprint' && answer === true) {
      userOptional.games.sprint.right++;
    } else if (game === 'sprint' && answer === false) {
      userOptional.games.sprint.wrong++;
    } else if (game === 'audiocall' && answer === true) {
      userOptional.games.audiocall.right++;
    } else if (game === 'audiocall' && answer === false) {
      userOptional.games.audiocall.wrong++;
    }
    await createUserWord(localStorage.getItem('userId') || '', wordId, { difficulty: 'empty', optional: userOptional }, localStorage.getItem('token') || '');
  }
}
